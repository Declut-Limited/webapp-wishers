import { io, type Socket } from "socket.io-client";
import { api, API_URL, tokenStore } from "@/lib/api";

// The API's Socket.IO gateway lives at the server root (no /api prefix), namespace /realtime.
const ORIGIN = API_URL?.replace(/\/api\/?$/, "");

export type RealtimeEvent = "wishlist:update" | "wishItem:update" | "wallet:update" | "notification";

let socket: Socket | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
const reconnectListeners = new Set<() => void>();
const subscriptions = new Map<() => void, RealtimeEvent[]>();

// Same model as the mobile app: the server pings "this changed", the page refetches.
export function connectRealtime() {
    if (socket || !ORIGIN) return;

    socket = io(`${ORIGIN}/realtime`, {
        transports: ["websocket"],
        // Read on every (re)connect so a refreshed access token is always used.
        auth: (cb) => cb({ token: tokenStore.getAccess() }),
    });

    socket.onAny(dispatch);

    // Anything missed while offline is picked up by refetching on reconnect.
    socket.io.on("reconnect", () => reconnectListeners.forEach((fn) => fn()));

    // The server drops sockets with an expired token and Socket.IO won't retry those itself:
    // a cheap authed request refreshes the token, then reconnect.
    socket.on("disconnect", (reason) => {
        if (reason !== "io server disconnect") return;
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = setTimeout(async () => {
            retryTimer = null;
            try {
                await api("/users/me");
                if (socket && !socket.connected) {
                    socket.connect();
                    reconnectListeners.forEach((fn) => fn());
                }
            } catch {
                // Session expired: AuthProvider logs out and disconnects.
            }
        }, 2000);
    });
}

export function disconnectRealtime() {
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = null;
    socket?.removeAllListeners();
    socket?.io.removeAllListeners();
    socket?.disconnect();
    socket = null;
}

// Calls handler on any of the given events, and after a reconnect. Returns the unsubscribe.
export function subscribeRealtime(events: RealtimeEvent[], handler: () => void) {
    subscriptions.set(handler, events);
    reconnectListeners.add(handler);
    return () => {
        subscriptions.delete(handler);
        reconnectListeners.delete(handler);
    };
}

function dispatch(event: string) {
    subscriptions.forEach((events, handler) => {
        if (events.includes(event as RealtimeEvent)) handler();
    });
}
