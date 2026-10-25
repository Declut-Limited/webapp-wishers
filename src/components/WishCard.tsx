import { Link } from "react-router-dom";
import { PiCaretRightBold, PiImageBold } from "react-icons/pi";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import type { WishItem } from "@/lib/types";
import { calculatePercentage, formatCurrency } from "@/utils/helper";

// Row card: small square photo, details, ring.
export function WishCard({ wish, to }: { wish: WishItem; to: string }) {
    const percent = calculatePercentage(wish.amountReceived ?? 0, wish.goalAmount ?? 0);

    return (
        <Link
            to={to}
            className="group flex min-w-0 items-center gap-4 rounded-2xl border bg-card p-3 transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/60"
        >
            <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {wish.images?.[0] ? (
                    <img src={wish.images[0]} alt="" loading="lazy" className="size-full object-cover" />
                ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground"><PiImageBold className="size-6" aria-hidden /></span>
                )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold">{wish.title}</p>
                <p className="truncate text-sm">
                    <span className="font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(wish.amountReceived ?? 0)}</span>
                    <span className="text-muted-foreground"> of {formatCurrency(wish.goalAmount ?? 0)}</span>
                </p>
                {wish.isCompleted && <Badge className="bg-brand-lime font-bold text-brand-dark">Completed</Badge>}
            </div>
            <ProgressRing percent={percent} size={44} stroke={4} />
            <PiCaretRightBold className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden />
        </Link>
    );
}
