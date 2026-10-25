import { Link } from "react-router-dom";
import { PiCaretRightBold, PiImageBold } from "react-icons/pi";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import type { Wishlist } from "@/lib/types";
import { calculatePercentage, formatShortCurrency, timeAgo } from "@/utils/helper";

// Row card (ClipBay's project row pattern): small cover on the left, details beside it, ring on the right.
export function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
    const percent = calculatePercentage(wishlist.totalAmountReceived ?? 0, wishlist.totalGoalAmount ?? 0);

    return (
        <Link
            to={`/wishlists/${wishlist._id}`}
            className="group flex min-w-0 items-center gap-4 rounded-2xl border bg-card p-3 transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/60"
        >
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-[4/3] sm:h-auto sm:w-24">
                {wishlist.image ? (
                    <img src={wishlist.image} alt="" loading="lazy" className="size-full object-cover" />
                ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground"><PiImageBold className="size-6" aria-hidden /></span>
                )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold" title={wishlist.title}>{wishlist.title}</p>
                <p className="truncate text-sm">
                    <span className="font-extrabold text-brand-light dark:text-brand-lime-dark">{formatShortCurrency(wishlist.totalAmountReceived ?? 0)}</span>
                    <span className="text-muted-foreground"> of {formatShortCurrency(wishlist.totalGoalAmount ?? 0)}</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {wishlist.isCompleted && <Badge className="bg-brand-lime font-bold text-brand-dark">Completed</Badge>}
                    <span>{wishlist.totalWishItems ?? 0} wish{wishlist.totalWishItems === 1 ? "" : "es"}</span>
                    <span>{wishlist.totalContributors ?? 0} giver{wishlist.totalContributors === 1 ? "" : "s"}</span>
                    <span className="hidden sm:inline">{timeAgo(wishlist.createdAt)}</span>
                </div>
            </div>

            <ProgressRing percent={percent} size={48} stroke={4} />
            <PiCaretRightBold className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden />
        </Link>
    );
}
