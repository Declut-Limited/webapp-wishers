import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setSessionExpiredHandler, tokenStore } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { connectRealtime, disconnectRealtime } from "@/lib/realtime";
import type { TokenResponse, User } from "@/lib/types";

type AuthContextType = {
    user: User | null;
    // True until a stored session has been checked on load.
    restoring: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (data: { name: string; email: string; password: string; referralCode?: string }) => Promise<{ otpToken: string }>;
    verifyEmail: (otpToken: string, otp: string) => Promise<void>;
    // A fresh code for the signed-in user; the API returns no otpToken if already verified.
    resendVerificationCode: () => Promise<string | undefined>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// otpToken for the email-verification code sent at sign-up.
export const VERIFY_OTP_KEY = "wishers_verify_otp";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [restoring, setRestoring] = useState(!!tokenStore.getRefresh());

    const clearSession = useCallback(() => {
        tokenStore.clear();
        sessionStorage.removeItem(VERIFY_OTP_KEY);
        queryClient.clear();
        setUser(null);
    }, []);

    useEffect(() => {
        setSessionExpiredHandler(clearSession);
        if (!tokenStore.getRefresh()) return;
        api<User>("/users/me")
            .then(setUser)
            .catch(() => clearSession())
            .finally(() => setRestoring(false));
    }, [clearSession]);

    // Live updates only for a signed-in, verified user; dropped on logout or session expiry.
    const realtimeUserId = user?.emailVerified ? user._id : null;
    useEffect(() => {
        if (!realtimeUserId) return;
        connectRealtime();
        return () => disconnectRealtime();
    }, [realtimeUserId]);

    const login = async (email: string, password: string) => {
        const res = await api<TokenResponse>("/auth/login", { method: "POST", body: { identifier: email, password }, auth: false });
        tokenStore.set(res.accessToken, res.refreshToken);
        const me = await api<User>("/users/me");
        setUser(me);
        return me;
    };

    const register: AuthContextType["register"] = async (data) => {
        const res = await api<TokenResponse & { otpToken: string }>("/auth/register", {
            method: "POST",
            body: { ...data, referralCode: data.referralCode?.trim() || undefined },
            auth: false,
        });
        tokenStore.set(res.accessToken, res.refreshToken);
        // The verify page picks this up, so the code just emailed isn't replaced by a resend.
        sessionStorage.setItem(VERIFY_OTP_KEY, res.otpToken);
        setUser(await api<User>("/users/me"));
        return { otpToken: res.otpToken };
    };

    const verifyEmail = async (otpToken: string, otp: string) => {
        await api("/auth/verify-email", { method: "POST", body: { otpToken, otp } });
        sessionStorage.removeItem(VERIFY_OTP_KEY);
        setUser(await api<User>("/users/me"));
    };

    const resendVerificationCode = async () => {
        const res = await api<{ otpToken?: string }>("/auth/resend-verification-email", { method: "POST" });
        return res.otpToken;
    };

    const logout = async () => {
        const refreshToken = tokenStore.getRefresh();
        if (refreshToken) await api("/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});
        clearSession();
    };

    const refreshUser = async () => {
        setUser(await api<User>("/users/me"));
    };

    return (
        <AuthContext.Provider value={{ user, restoring, login, register, verifyEmail, resendVerificationCode, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
