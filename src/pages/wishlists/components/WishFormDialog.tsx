import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { ImagesInput } from "@/components/form/ImagesInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSettings";
import type { WishItem } from "@/lib/types";
import type { ImageValue } from "@/services/imageService";
import { saveWish } from "@/services/wishlistService";
import { formatCurrency } from "@/utils/helper";
import { errorMessage } from "@/utils/validation";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; wishlistId: string; wish?: WishItem };

// Add a wish, or edit one. Mounted fresh each time it opens (key it on open).
export function WishFormDialog({ open, onOpenChange, wishlistId, wish }: Props) {
    const settings = useSettings();
    const [title, setTitle] = useState(wish?.title ?? "");
    const [description, setDescription] = useState(wish?.description ?? "");
    const [goal, setGoal] = useState(wish ? String(wish.goalAmount) : "");
    const [images, setImages] = useState<ImageValue[]>(wish?.images ?? []);
    const [saving, setSaving] = useState(false);

    // Like mobile: the goal is locked once someone has given towards it.
    const goalLocked = (wish?.amountReceived ?? 0) > 0;
    const maxImages = settings?.maxWishItemImages ?? 5;
    const min = settings?.minGoalAmount ?? 1;
    const max = settings?.maxGoalAmount;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const goalAmount = Number(goal);
        if (title.trim().length < 2 || !images.length || !goal) return toast.error("Add a name, at least one image and a goal amount");
        if (!Number.isInteger(goalAmount) || goalAmount < min) return toast.error(`Goal amount cannot be less than ${formatCurrency(min)}`);
        if (max && goalAmount > max) return toast.error(`Goal amount cannot be more than ${formatCurrency(max)}`);

        setSaving(true);
        try {
            await saveWish({ _id: wish?._id, wishlistId, title: title.trim(), description: description.trim(), goalAmount, images });
            toast.success(wish ? "Wish updated" : "Wish added");
            onOpenChange(false);
        } catch (err) {
            toast.error(errorMessage(err, "Could not save the wish"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !saving && onOpenChange(o)}>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">{wish ? "Edit wish" : "Add a wish"}</DialogTitle>
                        <DialogDescription>Up to {maxImages} photos; the first one is the cover.</DialogDescription>
                    </DialogHeader>

                    <ImagesInput id="wish-images" value={images} onChange={setImages} max={maxImages} />

                    <FormField id="wish-title" label="What do you wish for?" action={<span className="text-xs text-muted-foreground">{title.length}/100</span>}>
                        <Input id="wish-title" placeholder="e.g. iPhone 17 Pro" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
                    </FormField>

                    <FormField
                        id="wish-goal"
                        label="Goal amount (₦)"
                        hint={goalLocked ? "The goal can't change once someone has contributed." : `Minimum ${formatCurrency(min)}`}
                    >
                        <Input
                            id="wish-goal"
                            inputMode="numeric"
                            placeholder="0"
                            maxLength={settings?.maxGoalAmountDigits ?? 10}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value.replace(/\D/g, ""))}
                            disabled={goalLocked}
                            className="h-11"
                        />
                    </FormField>

                    <FormField id="wish-description" label="Description" hint="Size, colour, model or why it matters to you." action={<span className="text-xs text-muted-foreground">{description.length}/150</span>}>
                        <Textarea id="wish-description" placeholder="Optional" maxLength={150} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </FormField>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving} className="font-bold">
                            {saving ? "Saving…" : wish ? "Save changes" : "Add wish"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
