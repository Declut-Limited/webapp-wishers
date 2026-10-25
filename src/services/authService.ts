import { api } from "@/lib/api";

// Password reset, for guests: email -> 6-digit code (otpToken) -> resetToken -> new password.
export const authService = {
    forgotPassword: (email: string) =>
        api<{ otpToken: string; message: string }>("/auth/forgot-password", { method: "POST", body: { email }, auth: false }),

    resendResetCode: (otpToken: string) =>
        api<{ otpToken: string; message: string }>("/auth/resend-otp", { method: "POST", body: { otpToken }, auth: false }),

    verifyResetCode: (otpToken: string, otp: string) =>
        api<{ resetToken: string }>("/auth/verify-otp", { method: "POST", body: { otpToken, otp }, auth: false }),

    resetPassword: (resetToken: string, newPassword: string) =>
        api<{ message: string }>("/auth/reset-password", { method: "POST", body: { resetToken, newPassword }, auth: false }),
};
