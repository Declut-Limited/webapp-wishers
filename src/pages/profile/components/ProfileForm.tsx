import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PiCameraBold } from "react-icons/pi";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { uploadImages } from "@/services/imageService";
import { errorMessage } from "@/utils/validation";

// Photo and name (email can't change). Inline on the desktop profile; inside EditProfileDialog on phones.
export function ProfileForm({ inline, onDone, onCancel }: { inline?: boolean; onDone?: () => void; onCancel?: () => void }) {
    const { user, refreshUser } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(user?.name ?? "");
    const [photo, setPhoto] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
    useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

    if (!user) return null;
    const dirty = name.trim() !== user.name || !!photo;

    const pickPhoto = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
        if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5MB");
        setPhoto(file);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
        setSaving(true);
        try {
            const [image] = photo ? await uploadImages([photo], "users") : [undefined];
            await api("/users/me", { method: "PATCH", body: { name: name.trim(), ...(image ? { image } : {}) } });
            await refreshUser();
            setPhoto(null);
            toast.success("Profile updated");
            onDone?.();
        } catch (err) {
            toast.error(errorMessage(err, "Could not update your profile"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className={cn("flex items-center gap-4", !inline && "flex-col")}>
                <button type="button" onClick={() => fileRef.current?.click()} className="relative shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="Change profile photo">
                    <UserAvatar name={user.name} image={photoUrl ?? user.image} className={inline ? "size-20" : "size-24"} />
                    <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                        <PiCameraBold className="size-3.5" />
                    </span>
                </button>
                {inline && (
                    <div className="min-w-0">
                        <p className="font-semibold">Profile photo</p>
                        <p className="text-sm text-muted-foreground">JPG or PNG, up to 5MB.</p>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>Change photo</Button>
                    </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} />
            </div>

            <div className={cn("grid gap-5", inline && "sm:grid-cols-2")}>
                <FormField id={`name${inline ? "-i" : ""}`} label="Full name">
                    <Input id={`name${inline ? "-i" : ""}`} autoComplete="name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </FormField>
                <FormField id={`email${inline ? "-i" : ""}`} label="Email" hint="Your email can't be changed.">
                    <Input id={`email${inline ? "-i" : ""}`} value={user.email} disabled className="h-11" />
                </FormField>
            </div>

            <div className={cn("flex gap-2", inline ? "justify-start" : "justify-end")}>
                {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>}
                <Button type="submit" disabled={!dirty || saving} className="font-bold">{saving ? "Saving…" : "Save changes"}</Button>
            </div>
        </form>
    );
}
