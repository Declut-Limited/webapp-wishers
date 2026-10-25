import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PiDotsThreeBold, PiGiftBold, PiImageBold, PiPencilSimpleBold, PiPlusBold, PiTrashBold } from "react-icons/pi";
import { toast } from "sonner";
import { BackLink } from "@/components/BackLink";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";
import { ShareLinkBox } from "@/components/ShareLinkBox";
import { WishlistInsights } from "@/components/WishlistInsights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { WishCard } from "@/components/WishCard";
import { WishesTable } from "@/components/WishesTable";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { useSettings } from "@/hooks/useSettings";
import type { WishlistDetail } from "@/lib/types";
import { deleteWishlist } from "@/services/wishlistService";
import { calculatePercentage, formatCurrency, formatDateShort } from "@/utils/helper";
import { errorMessage } from "@/utils/validation";
import { WishFormDialog } from "../components/WishFormDialog";
import { WishlistFormDialog } from "../components/WishlistFormDialog";

export default function WishlistItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const settings = useSettings();
    const { data: wishlist, isPending, error } = useLiveQuery<WishlistDetail>(`/wishlists/${id}`, ["wishlist:update", "wishItem:update"]);

    const [editOpen, setEditOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);

    if (isPending) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-2xl" />
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}</div>
            </div>
        );
    }
    if (error || !wishlist) {
        return (
            <>
                <BackLink to="/wishlists" label="Wishlists" />
                <p className="py-16 text-center text-muted-foreground">{error?.message || "Wishlist not found"}</p>
            </>
        );
    }

    const wishes = wishlist.wishItems ?? [];
    const percent = calculatePercentage(wishlist.totalAmountReceived ?? 0, wishlist.totalGoalAmount ?? 0);
    const atWishLimit = !!settings?.wishItemCreationLimit && wishes.length >= settings.wishItemCreationLimit;

    const openWishForm = () => {
        if (atWishLimit) return toast.error(`You cannot create more than ${settings!.wishItemCreationLimit} wishes in a wishlist`);
        setFormKey((k) => k + 1);
        setWishOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteWishlist(wishlist._id);
            toast.success("Wishlist deleted");
            navigate("/wishlists", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not delete the wishlist"));
        }
    };


    return (
        <>
            {/* Phones and tablets: the mobile app's layout. */}
            <div className="lg:hidden">
            <BackLink to="/wishlists" label="Wishlists" />

            {/* Cover with the title over it, kept short (as on mobile). */}
            <section className="relative h-48 overflow-hidden rounded-2xl bg-muted sm:h-56">
                {wishlist.image ? (
                    <img src={wishlist.image} alt="" className="absolute inset-0 size-full object-cover" />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground"><PiImageBold className="size-10" aria-hidden /></span>
                )}
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/85" />
                {/* Completed wishlists can't be edited or deleted (same as mobile). */}
                {!wishlist.isCompleted && (
                    <div className="absolute top-3 right-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" aria-label="Wishlist options" className="rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"><PiDotsThreeBold className="size-5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => { setFormKey((k) => k + 1); setEditOpen(true); }}>
                                    <PiPencilSimpleBold /> Edit wishlist
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                                    <PiTrashBold /> Delete wishlist
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    {wishlist.isCompleted && <Badge className="mb-2 bg-brand-lime font-bold text-brand-dark">Completed</Badge>}
                    <h1 className="text-2xl font-extrabold tracking-tight [overflow-wrap:anywhere]">{wishlist.title}</h1>
                    {wishlist.description && <p className="mt-1 line-clamp-2 text-sm text-white/80 [overflow-wrap:anywhere]">{wishlist.description}</p>}
                </div>
            </section>

            {/* Insight: raised so far, with the ring. */}
            <section className="mt-4 flex items-center gap-4 rounded-2xl bg-secondary p-5">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Raised so far</p>
                    <p className="truncate text-3xl font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(wishlist.totalAmountReceived ?? 0)}</p>
                    <p className="text-sm text-muted-foreground">of {formatCurrency(wishlist.totalGoalAmount ?? 0)} goal</p>
                </div>
                <ProgressRing percent={percent} size={68} stroke={6} />
            </section>

            <div className="mt-3">
                <WishlistInsights wishlist={wishlist} />
            </div>

            <div className="mt-3">
                <ShareLinkBox title={wishlist.title} link={wishlist.link} />
            </div>

            <div className="mt-8 mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold">Wishes <span className="text-muted-foreground">({wishes.length})</span></h2>
                {!wishlist.isCompleted && <Button onClick={openWishForm} className="font-bold"><PiPlusBold /> Add wish</Button>}
            </div>

            {wishes.length === 0 ? (
                <EmptyState
                    icon={PiGiftBold}
                    title="No wishes yet"
                    message="Add the things you'd love, each with photos and a goal amount. Givers choose which wish to give towards."
                    action={<Button onClick={openWishForm} className="font-bold"><PiPlusBold /> Add your first wish</Button>}
                    className="rounded-2xl border border-dashed"
                />
            ) : (
                <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
                    {wishes.map((w) => <WishCard key={w._id} wish={w} to={`/wishlists/${wishlist._id}/wishes/${w._id}`} />)}
                </div>
            )}
            </div>

            {/* Desktop: wishes on the left, progress and sharing in a side panel. */}
            <div className="hidden items-start gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <section className="flex items-start gap-5">
                        <div className="size-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                            {wishlist.image ? (
                                <img src={wishlist.image} alt="" className="size-full object-cover" />
                            ) : (
                                <span className="flex size-full items-center justify-center text-muted-foreground"><PiImageBold className="size-8" aria-hidden /></span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h1 className="truncate text-3xl font-extrabold tracking-tight">{wishlist.title}</h1>
                                {wishlist.isCompleted && <Badge className="bg-brand-lime font-bold text-brand-dark">Completed</Badge>}
                            </div>
                            {wishlist.description && <p className="mt-1 line-clamp-2 text-muted-foreground">{wishlist.description}</p>}
                            <p className="mt-2 text-sm text-muted-foreground">Created {formatDateShort(wishlist.createdAt)}</p>
                        </div>
                        {!wishlist.isCompleted && (
                            <div className="flex shrink-0 gap-2">
                                <Button variant="outline" onClick={() => { setFormKey((k) => k + 1); setEditOpen(true); }} className="font-bold"><PiPencilSimpleBold /> Edit</Button>
                                <Button variant="outline" size="icon" onClick={() => setDeleteOpen(true)} aria-label="Delete wishlist" className="text-destructive hover:text-destructive"><PiTrashBold /></Button>
                            </div>
                        )}
                    </section>

                    <WishlistInsights wishlist={wishlist} />

                    <section aria-labelledby="wishes-d" className="overflow-hidden rounded-2xl border bg-card">
                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                            <h2 id="wishes-d" className="font-bold">Wishes <span className="text-muted-foreground">({wishes.length})</span></h2>
                            {!wishlist.isCompleted && <Button size="sm" onClick={openWishForm} className="font-bold"><PiPlusBold /> Add wish</Button>}
                        </div>
                        {wishes.length === 0 ? (
                            <EmptyState
                                icon={PiGiftBold}
                                title="No wishes yet"
                                message="Add the things you'd love, each with photos and a goal amount. Givers choose which wish to give towards."
                                action={!wishlist.isCompleted && <Button onClick={openWishForm} className="font-bold"><PiPlusBold /> Add your first wish</Button>}
                                className="border-t"
                            />
                        ) : (
                            <div className="border-t">
                                <WishesTable wishlistId={wishlist._id} wishes={wishes} />
                            </div>
                        )}
                    </section>
                </div>

                <aside className="sticky top-24 flex flex-col gap-4">
                    <section className="rounded-2xl border bg-card p-5">
                        <div className="flex items-center gap-4">
                            <ProgressRing percent={percent} size={72} stroke={6} />
                            <div className="min-w-0">
                                <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Raised</p>
                                <p className="truncate text-2xl font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(wishlist.totalAmountReceived ?? 0)}</p>
                                <p className="text-sm text-muted-foreground">of {formatCurrency(wishlist.totalGoalAmount ?? 0)}</p>
                            </div>
                        </div>
                    </section>
                    <ShareLinkBox title={wishlist.title} link={wishlist.link} />
                </aside>
            </div>

            <WishlistFormDialog key={`edit-${formKey}`} open={editOpen} onOpenChange={setEditOpen} wishlist={wishlist} />
            <WishFormDialog key={`wish-${formKey}`} open={wishOpen} onOpenChange={setWishOpen} wishlistId={wishlist._id} />
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete this wishlist?"
                description="Its wishes and share link go with it. This can't be undone."
                confirmLabel="Delete wishlist"
                destructive
                onConfirm={handleDelete}
            />
        </>
    );
}
