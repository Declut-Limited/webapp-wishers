import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { ImagesInput } from "@/components/form/ImagesInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Wishlist } from "@/lib/types";
import type { ImageValue } from "@/services/imageService";
import { saveWishlist } from "@/services/wishlistService";
import { errorMessage } from "@/utils/validation";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; wishlist?: Wishlist };

// Create, or edit when a wishlist is passed. Mounted fresh each time it opens (key it on open).
export function WishlistFormDialog({ open, onOpenChange, wishlist }: Props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(wishlist?.title ?? "");
    const [description, setDescription] = useState(wishlist?.description ?? "");
    const [images, setImages] = useState<ImageValue[]>(wishlist?.image ? [wishlist.image] : []);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim().length < 2) return toast.error("Give your wishlist a name (at least 2 characters)");

        setSaving(true);
        try {
            const saved = await saveWishlist({ _id: wishlist?._id, title: title.trim(), description: description.trim(), image: images[0] });
            toast.success(wishlist ? "Wishlist updated" : "Wishlist created, now add your wishes");
            onOpenChange(false);
            if (!wishlist) navigate(`/wishlists/${saved._id}`);
        } catch (err) {
            toast.error(errorMessage(err, "Could not save the wishlist"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !saving && onOpenChange(o)}>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">{wishlist ? "Edit wishlist" : "New wishlist"}</DialogTitle>
                        <DialogDescription>{wishlist ? "Update the name, note or cover photo." : "Give it a name and a cover photo. You'll add wishes next."}</DialogDescription>
                    </DialogHeader>

                    <ImagesInput id="wishlist-image" value={images} onChange={setImages} />

                    <FormField id="wishlist-title" label="Wishlist name" action={<span className="text-xs text-muted-foreground">{title.length}/100</span>}>
                        <Input id="wishlist-title" placeholder="e.g. My 30th birthday" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" autoFocus />
                    </FormField>

                    <FormField id="wishlist-description" label="Description" hint="A short note for the people giving." action={<span className="text-xs text-muted-foreground">{description.length}/150</span>}>
                        <Textarea id="wishlist-description" placeholder="Optional" maxLength={150} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </FormField>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving} className="font-bold">
                            {saving ? "Saving…" : wishlist ? "Save changes" : "Create wishlist"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
