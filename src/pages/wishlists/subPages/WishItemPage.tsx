import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PiHandHeartBold, PiImageBold, PiPencilSimpleBold, PiTrashBold } from "react-icons/pi";
import { toast } from "sonner";
import { BackLink } from "@/components/BackLink";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContributorSheet } from "@/components/ContributorSheet";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/UserAvatar";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Contributor, Page, WishItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { deleteWish } from "@/services/wishlistService";
import { calculatePercentage, formatCurrency, timeAgo } from "@/utils/helper";
import { errorMessage } from "@/utils/validation";
import { WishFormDialog } from "../components/WishFormDialog";

export default function WishItemPage() {
    const { id: wishlistId, wishId } = useParams();
    const navigate = useNavigate();
    const { data: wish, isPending, error } = useLiveQuery<WishItem>(`/wish-items/${wishId}`, ["wishItem:update"]);
    const givers = useLiveQuery<Page<Contributor>>(`/wish-items/${wishId}/contributors?limit=100`, ["wishItem:update"]);

    const [activeImage, setActiveImage] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [giverId, setGiverId] = useState<string | null>(null);

    const back = <BackLink to={`/wishlists/${wishlistId}`} label="Back to wishlist" />;

    if (isPending) {
        return (
            <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-24" /><Skeleton className="h-40" /></div>
            </div>
        );
    }
    if (error || !wish) return <>{back}<p className="py-16 text-center text-muted-foreground">{error?.message || "Wish not found"}</p></>;

    const percent = calculatePercentage(wish.amountReceived ?? 0, wish.goalAmount ?? 0);
    const hasGifts = (wish.amountReceived ?? 0) > 0;
    const list = givers.data?.results ?? [];
    const images = wish.images ?? [];

    const handleDelete = async () => {
        try {
            await deleteWish(wish._id);
            toast.success("Wish deleted");
            navigate(`/wishlists/${wishlistId}`, { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not delete the wish"));
        }
    };

    return (
        <>
            {back}

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:aspect-square">
                        {images[activeImage] ? (
                            <img src={images[activeImage]} alt={wish.title} className="size-full object-cover" />
                        ) : (
                            <span className="flex size-full items-center justify-center text-muted-foreground"><PiImageBold className="size-10" aria-hidden /></span>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    aria-label={`Show image ${i + 1}`}
                                    aria-pressed={i === activeImage}
                                    className={cn("size-16 shrink-0 overflow-hidden rounded-xl border-2 transition", i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}
                                >
                                    <img src={src} alt="" className="size-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        {wish.isCompleted && <Badge className="mb-2 bg-brand-lime font-bold text-brand-dark">Completed</Badge>}
                        <h1 className="text-2xl font-extrabold tracking-tight [overflow-wrap:anywhere] md:text-3xl">{wish.title}</h1>
                        {wish.description && <p className="mt-2 whitespace-pre-line text-muted-foreground">{wish.description}</p>}
                    </div>

                    <div className="space-y-3 rounded-2xl border bg-card p-5">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Raised</p>
                                <p className="text-3xl font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(wish.amountReceived ?? 0)}</p>
                            </div>
                            <p className="text-right text-sm text-muted-foreground">of <span className="font-bold text-foreground">{formatCurrency(wish.goalAmount ?? 0)}</span></p>
                        </div>
                        <Progress value={percent} aria-label={`${percent}% raised`} className="h-2.5" />
                        <p className="flex justify-between text-sm text-muted-foreground">
                            <span>{wish.contributorCount ?? list.length} giver{(wish.contributorCount ?? list.length) === 1 ? "" : "s"}</span>
                            <span className="font-semibold text-foreground">{percent}%</span>
                        </p>
                    </div>

                    {!wish.isCompleted && <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => { setFormKey((k) => k + 1); setEditOpen(true); }} className="font-bold">
                            <PiPencilSimpleBold /> Edit wish
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (hasGifts ? toast.error("A wish that has received gifts can't be deleted") : setDeleteOpen(true))}
                            className="font-bold text-destructive hover:text-destructive"
                        >
                            <PiTrashBold /> Delete
                        </Button>
                    </div>}
                </div>
            </div>

            <section aria-labelledby="givers" className="mt-10">
                <h2 id="givers" className="mb-4 text-xl font-extrabold">Givers <span className="text-muted-foreground">({list.length})</span></h2>

                {givers.isPending ? (
                    <Skeleton className="h-48 rounded-2xl" />
                ) : list.length === 0 ? (
                    <EmptyState icon={PiHandHeartBold} title="No givers yet" message="Share your wishlist link; every gift towards this wish shows up here." className="rounded-2xl border border-dashed" />
                ) : (
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-5">Giver</TableHead>
                                    <TableHead className="hidden md:table-cell">Message</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="hidden pr-5 text-right sm:table-cell">When</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {list.map((g) => (
                                    <TableRow key={g._id} onClick={() => setGiverId(g._id)} className="cursor-pointer">
                                        <TableCell className="pl-5">
                                            <button type="button" className="flex items-center gap-3 text-left font-semibold focus-visible:underline focus-visible:outline-none" onClick={() => setGiverId(g._id)}>
                                                <UserAvatar name={g.isAnonymous ? undefined : g.name} image={g.isAnonymous ? undefined : g.image} className="size-9" />
                                                {g.isAnonymous || !g.name ? "Anonymous" : g.name}
                                            </button>
                                        </TableCell>
                                        <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">{g.message || "—"}</TableCell>
                                        <TableCell className="text-right font-bold text-brand-light dark:text-brand-lime-dark">{formatCurrency(g.amount ?? 0, 2)}</TableCell>
                                        <TableCell className="hidden pr-5 text-right text-muted-foreground sm:table-cell">{timeAgo(g.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </section>

            <WishFormDialog key={formKey} open={editOpen} onOpenChange={setEditOpen} wishlistId={wishlistId!} wish={wish} />
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete this wish?"
                description="It will be removed from your wishlist. This can't be undone."
                confirmLabel="Delete wish"
                destructive
                onConfirm={handleDelete}
            />
            <ContributorSheet id={giverId} onClose={() => setGiverId(null)} />
        </>
    );
}
