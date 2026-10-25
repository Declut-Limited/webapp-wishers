import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";

// Phones: the mobile "Edit Profile" screen as a dialog.
export function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold">Edit profile</DialogTitle>
                    <DialogDescription>Update your photo and name.</DialogDescription>
                </DialogHeader>
                <ProfileForm onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
