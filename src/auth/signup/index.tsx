import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeading } from "@/components/form/AuthHeading";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage, PASSWORD_HINT, passwordError } from "@/utils/validation";

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    // Invite links: /signup?ref=CODE
    const [params] = useSearchParams();
    const [form, setForm] = useState({ name: "", email: "", password: "", referralCode: params.get("ref") ?? "" });
    const [loading, setLoading] = useState(false);

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const name = form.name.trim();
        const email = form.email.trim();
        if (!name || !email || !form.password) return toast.error("Enter your name, email and password");
        if (name.length < 2) return toast.error("Name must be at least 2 characters");
        const pwError = passwordError(form.password);
        if (pwError) return toast.error(pwError);

        setLoading(true);
        try {
            await register({ name, email, password: form.password, referralCode: form.referralCode });
            toast.success("Account created, check your email for the code");
            navigate("/verify-email", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not create your account"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <AuthHeading title="Create your account">Start a wishlist in minutes.</AuthHeading>

            <FormField id="name" label="Full name">
                <Input id="name" autoComplete="name" placeholder="Enter your name" maxLength={100} value={form.name} onChange={set("name")} className="h-11" />
            </FormField>

            <FormField id="email" label="Email">
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className="h-11" />
            </FormField>

            <FormField id="password" label="Password" hint={PASSWORD_HINT}>
                <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" maxLength={64} aria-describedby="password-hint" value={form.password} onChange={set("password")} />
            </FormField>

            <FormField id="referralCode" label="Referral code (optional)">
                <Input id="referralCode" placeholder="Enter a referral code" maxLength={20} autoCapitalize="characters" value={form.referralCode} onChange={set("referralCode")} className="h-11" />
            </FormField>

            <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading}>
                {loading ? "Creating account…" : "Sign up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
            </p>
        </form>
    );
}
