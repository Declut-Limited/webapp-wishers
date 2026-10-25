import { Link } from "react-router-dom";
import { PiImageBold, PiListHeartBold } from "react-icons/pi";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Wishlist } from "@/lib/types";
import { calculatePercentage, formatShortCurrency } from "@/utils/helper";

export function TopWishlistCard({ wishlist, loading, onNew }: { wishlist?: Wishlist; loading: boolean; onNew: () => void }) {
    return (
        <section aria-labelledby="top-wishlist" className="min-w-0 rounded-2xl border bg-card p-5">
            <h2 id="top-wishlist" className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Your top wishlist</h2>

            {loading ? (
                <div className="mt-4 flex items-center gap-4">
                    <Skeleton className="h-20 w-16 rounded-xl sm:aspect-[4/3] sm:h-auto sm:w-24" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ) : wishlist ? (
                <Link
                    to={`/wishlists/${wishlist._id}`}
                    className="mt-4 flex min-w-0 items-center gap-4 rounded-2xl transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    {wishlist.image ? (
                        <img src={wishlist.image} alt="" className="h-20 w-16 shrink-0 rounded-xl sm:aspect-[4/3] sm:h-auto sm:w-24 bg-muted object-cover" />
                    ) : (
                        <span className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl sm:aspect-[4/3] sm:h-auto sm:w-24 bg-muted text-muted-foreground">
                            <PiImageBold className="size-7" aria-hidden />
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold">{wishlist.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                            <span className="text-base font-extrabold text-brand-light dark:text-brand-lime-dark">{formatShortCurrency(wishlist.totalAmountReceived ?? 0)}</span>
                            {` raised of ${formatShortCurrency(wishlist.totalGoalAmount ?? 0)}`}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {wishlist.totalContributors ?? 0} giver{wishlist.totalContributors === 1 ? "" : "s"} · {wishlist.totalWishItems ?? 0} wish{wishlist.totalWishItems === 1 ? "" : "es"}
                        </p>
                    </div>
                    <ProgressRing percent={calculatePercentage(wishlist.totalAmountReceived ?? 0, wishlist.totalGoalAmount ?? 0)} />
                </Link>
            ) : (
                <EmptyState
                    icon={PiListHeartBold}
                    title="No open wishlists"
                    message="Create a wishlist and share it to start receiving gifts."
                    action={<Button onClick={onNew} className="font-bold">New wishlist</Button>}
                    className="py-6"
                />
            )}
        </section>
    );
}
