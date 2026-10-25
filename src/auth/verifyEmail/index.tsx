import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeading } from "@/components/form/AuthHeading";
import { CODE_LENGTH, CodeInput } from "@/components/form/CodeInput";
import { Button } from "@/components/ui/button";
import { useAuth, VERIFY_OTP_KEY } from "@/contexts/AuthContext";
import { useCooldown } from "@/hooks/useCooldown";
import { errorMessage } from "@/utils/validation";

const RESEND_SECONDS = 60;

export default function VerifyEmail() {
    const { user, verifyEmail, resendVerificationCode, logout } = useAuth();
    const navigate = useNavigate();
    const [otpToken, setOtpToken] = useState(() => sessionStorage.getItem(VERIFY_OTP_KEY) ?? "");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const cooldown = useCooldown(RESEND_SECONDS, !!otpToken);
    const autoSent = useRef(false);

    const handleResend = async () => {
        setSending(true);
        try {
            const token = await resendVerificationCode();
            if (token) {
                setOtpToken(token);
                sessionStorage.setItem(VERIFY_OTP_KEY, token);
            }
            cooldown.start();
            toast.success("Code sent to your email");
        } catch (err) {
            toast.error(errorMessage(err, "Could not send the code"));
        } finally {
            setSending(false);
        }
    };

    // Arrived from login (no code from sign-up in hand): send one straight away, once.
    useEffect(() => {
        if (otpToken || autoSent.current) return;
        autoSent.current = true;
        handleResend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = async (value = code) => {
        if (value.length !== CODE_LENGTH) return toast.error("Enter the 6-digit code");
        if (!otpToken) return toast.error("Request a new code first");

        setLoading(true);
        try {
            await verifyEmail(otpToken, value);
            toast.success("Email verified");
            navigate("/", { replace: true });
        } catch (err) {
            setCode("");
            toast.error(errorMessage(err, "Invalid or expired code"));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submit();
    };

    const switchAccount = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AuthHeading title="Verify your email">
                Enter the 6-digit code we sent to <span className="font-semibold text-foreground">{user?.email || "your email"}</span>.
            </AuthHeading>

            <CodeInput value={code} onChange={setCode} onComplete={submit} disabled={loading} />

            <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading || code.length !== CODE_LENGTH}>
                {loading ? "Verifying…" : "Verify email"}
            </Button>

            <div className="flex flex-col items-center gap-2 text-sm">
                <p className="text-muted-foreground">
                    Didn't get it?{" "}
                    <button type="button" onClick={handleResend} disabled={sending || cooldown.left > 0} className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline">
                        {cooldown.left > 0 ? `Resend in ${cooldown.left}s` : sending ? "Sending…" : "Resend code"}
                    </button>
                </p>
                <button type="button" onClick={switchAccount} className="font-semibold text-muted-foreground hover:text-foreground hover:underline">
                    Use a different account
                </button>
            </div>
        </form>
    );
}
