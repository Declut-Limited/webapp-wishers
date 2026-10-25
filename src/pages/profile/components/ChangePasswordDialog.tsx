import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { errorMessage, PASSWORD_HINT, passwordError } from "@/utils/validation";

// The API ends every session on a password change, so this signs straight back in with the new one.
// Inline on the desktop profile; inside ChangePasswordDialog on phones.
export function ChangePasswordForm({ onDone, onCancel, inline }: { onDone?: () => void; onCancel?: () => void; inline?: boolean }) {
    const { user, login } = useAuth();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.current || !form.next || !form.confirm) return toast.error("Fill in all three fields");
        const pwError = passwordError(form.next);
        if (pwError) return toast.error(pwError);
        if (form.next !== form.confirm) return toast.error("New passwords do not match");
        if (form.next === form.current) return toast.error("Choose a password different from your current one");

        setSaving(true);
        try {
            await api("/auth/change-password", { method: "PATCH", body: { currentPassword: form.current, newPassword: form.next } });
            await login(user!.email, form.next);
            toast.success("Password changed");
            setForm({ current: "", next: "", confirm: "" });
            onDone?.();
        } catch (err) {
            toast.error(errorMessage(err, "Could not change your password"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className={cn("grid gap-5", inline && "sm:grid-cols-3")}>
                <FormField id={`currentPassword${inline ? "-i" : ""}`} label="Current password">
                    <PasswordInput id={`currentPassword${inline ? "-i" : ""}`} autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
                </FormField>
                <FormField id={`newPassword${inline ? "-i" : ""}`} label="New password" hint={inline ? undefined : PASSWORD_HINT}>
                    <PasswordInput id={`newPassword${inline ? "-i" : ""}`} autoComplete="new-password" maxLength={64} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
                </FormField>
                <FormField id={`confirmPassword${inline ? "-i" : ""}`} label="Confirm new password">
                    <PasswordInput id={`confirmPassword${inline ? "-i" : ""}`} autoComplete="new-password" maxLength={64} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
                </FormField>
            </div>
            {inline && <p className="-mt-2 text-xs text-muted-foreground">{PASSWORD_HINT} Other devices are signed out.</p>}
            <div className={cn("flex gap-2", inline ? "justify-start" : "justify-end")}>
                {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>}
                <Button type="submit" disabled={saving || !form.current || !form.next || !form.confirm} className="font-bold">{saving ? "Saving…" : "Change password"}</Button>
            </div>
        </form>
    );
}

export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold">Change password</DialogTitle>
                    <DialogDescription>You'll stay signed in here; other devices are signed out.</DialogDescription>
                </DialogHeader>
                <ChangePasswordForm onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
