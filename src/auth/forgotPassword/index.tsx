import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeading } from "@/components/form/AuthHeading";
import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import { errorMessage } from "@/utils/validation";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { email?: string } | null };
    const [email, setEmail] = useState(state?.email ?? "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) return toast.error("Enter a valid email");

        setLoading(true);
        try {
            const { otpToken } = await authService.forgotPassword(value);
            navigate("/reset-password", { state: { email: value, otpToken } });
        } catch (err) {
            toast.error(errorMessage(err, "Could not send the code"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <AuthHeading title="Forgot password?">
                Enter the email on your account and we'll send you a 6-digit code to reset your password.
            </AuthHeading>

            <FormField id="email" label="Email">
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" autoFocus />
            </FormField>

            <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading}>
                {loading ? "Sending code…" : "Send code"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
            </p>
        </form>
    );
}
