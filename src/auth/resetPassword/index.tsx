import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeading } from "@/components/form/AuthHeading";
import { CODE_LENGTH, CodeInput } from "@/components/form/CodeInput";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { useCooldown } from "@/hooks/useCooldown";
import { authService } from "@/services/authService";
import { errorMessage, PASSWORD_HINT, passwordError } from "@/utils/validation";

const RESEND_SECONDS = 60;

export default function ResetPassword() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { email?: string; otpToken?: string } | null };
    const [otpToken, setOtpToken] = useState(state?.otpToken ?? "");
    const [code, setCode] = useState("");
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const cooldown = useCooldown(RESEND_SECONDS, true);

    // Only reachable from the forgot-password step (a refresh loses the code token).
    if (!state?.otpToken) return <Navigate to="/forgot-password" replace />;

    const handleResend = async () => {
        setSending(true);
        try {
            const res = await authService.resendResetCode(otpToken);
            setOtpToken(res.otpToken);
            cooldown.start();
            toast.success("Code sent to your email");
        } catch (err) {
            toast.error(errorMessage(err, "Could not send the code"));
        } finally {
            setSending(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = passwords;
        if (code.length !== CODE_LENGTH) return toast.error("Enter the 6-digit code");
        if (!newPassword || !confirmPassword) return toast.error("Fill in both password fields");
        const pwError = passwordError(newPassword);
        if (pwError) return toast.error(pwError);
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            const { resetToken } = await authService.verifyResetCode(otpToken, code);
            await authService.resetPassword(resetToken, newPassword);
            toast.success("Password reset, please log in");
            navigate("/login", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not reset your password"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <AuthHeading title="Reset password">
                Enter the 6-digit code sent to <span className="font-semibold text-foreground">{state.email || "your email"}</span> and choose a new password.
            </AuthHeading>

            <CodeInput value={code} onChange={setCode} disabled={loading} />

            <FormField id="newPassword" label="New password" hint={PASSWORD_HINT}>
                <PasswordInput id="newPassword" autoComplete="new-password" placeholder="New password" maxLength={64} aria-describedby="newPassword-hint" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            </FormField>

            <FormField id="confirmPassword" label="Confirm new password">
                <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Confirm new password" maxLength={64} value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
            </FormField>

            <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading}>
                {loading ? "Resetting…" : "Reset password"}
            </Button>

            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <p>
                    Didn't get it?{" "}
                    <button type="button" onClick={handleResend} disabled={sending || cooldown.left > 0} className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline">
                        {cooldown.left > 0 ? `Resend in ${cooldown.left}s` : sending ? "Sending…" : "Resend code"}
                    </button>
                </p>
                <Link to="/login" className="font-semibold hover:text-foreground hover:underline">Back to log in</Link>
            </div>
        </form>
    );
}
