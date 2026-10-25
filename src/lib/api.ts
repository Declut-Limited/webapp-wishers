export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const ACCESS_KEY = "wishers_access_token";
const REFRESH_KEY = "wishers_refresh_token";

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// The API returns tokens in the body (no cookies), so they live in localStorage, same pair as the mobile app.
export const tokenStore = {
    getAccess: () => localStorage.getItem(ACCESS_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_KEY),
    set(accessToken: string, refreshToken: string) {
        localStorage.setItem(ACCESS_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);
    },
    clear() {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

// Set by AuthProvider: called when the refresh token is no longer valid.
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: () => void) {
    onSessionExpired = handler;
}

// One refresh at a time, shared by every request that hit a 401 together.
let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) return false;
        tokenStore.set(json.data.accessToken, json.data.refreshToken);
        return true;
    } catch {
        return false;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
};

// Unwraps the API's { success, data } envelope; throws ApiError with the server's message otherwise.
export async function api<T>(path: string, { method = "GET", body, auth = true }: RequestOptions = {}): Promise<T> {
    if (!API_URL) throw new ApiError("VITE_API_URL is not set", 0);

    const send = () => {
        const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
        if (auth) {
            const token = tokenStore.getAccess();
            if (token) headers.Authorization = `Bearer ${token}`;
        }
        return fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    };

    let res: Response;
    try {
        res = await send();
        if (res.status === 401 && auth) {
            refreshing ??= refreshTokens().finally(() => { refreshing = null; });
            if (!(await refreshing)) {
                tokenStore.clear();
                onSessionExpired?.();
                throw new ApiError("Your session has expired, please log in again", 401);
            }
            res = await send();
        }
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError("Check your network connection", 0);
    }

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
        const message = json?.error?.message;
        throw new ApiError(Array.isArray(message) ? message[0] : message || "Something went wrong", res.status);
    }
    return json.data as T;
}
