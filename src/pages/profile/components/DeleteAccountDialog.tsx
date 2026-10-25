import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { errorMessage } from "@/utils/validation";

// POST /users/me/delete with the password to confirm.
export function DeleteAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!password) return toast.error("Enter your password to confirm");

        setDeleting(true);
        try {
            await api("/users/me/delete", { method: "POST", body: { password } });
            await logout();
            toast.success("Your account has been deleted");
            navigate("/login", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not delete your account"));
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !deleting && onOpenChange(o)}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-destructive">Delete account</DialogTitle>
                        <DialogDescription>
                            Your account is closed and you'll be signed out everywhere. You won't be able to log in again with it.
                        </DialogDescription>
                    </DialogHeader>
                    <FormField id="deletePassword" label="Password">
                        <PasswordInput id="deletePassword" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormField>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>Cancel</Button>
                        <Button type="submit" variant="destructive" disabled={deleting} className="font-bold">{deleting ? "Deleting…" : "Delete my account"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
