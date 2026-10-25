import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeading } from "@/components/form/AuthHeading";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/utils/validation";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return toast.error("Enter your email and password");

        setLoading(true);
        try {
            const me = await login(email.trim(), password);
            // Unverified accounts are signed in but must confirm their email first.
            if (!me.emailVerified) {
                toast.info("Verify your email to continue");
                navigate("/verify-email", { replace: true });
            } else {
                toast.success("Welcome back!");
                navigate("/", { replace: true });
            }
        } catch (err) {
            toast.error(errorMessage(err, "Could not log in"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <AuthHeading title="Welcome back">Log in to your Wishers account.</AuthHeading>

            <FormField id="email" label="Email">
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
            </FormField>

            <FormField
                id="password"
                label="Password"
                action={
                    <Link to="/forgot-password" state={{ email: email.trim() }} className="text-sm font-semibold text-primary hover:underline">
                        Forgot password?
                    </Link>
                }
            >
                <PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormField>

            <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading}>
                {loading ? "Logging in…" : "Log in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
            </p>
        </form>
    );
}
