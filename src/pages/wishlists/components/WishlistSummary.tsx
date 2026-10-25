import { Progress } from "@/components/ui/progress";
import type { Wishlist } from "@/lib/types";
import { formatCurrency, formatShortCurrency } from "@/utils/helper";

// The mobile wishlists tab's overview: total raised, completed and givers.
// Phones: raised on the left, the two counts stacked on the right (as on mobile).
// Desktop: one wide strip, raised with its progress against the combined goal, then each count in its own column.
export function WishlistSummary({ wishlists }: { wishlists: Wishlist[] }) {
    const total = wishlists.length;
    const raised = wishlists.reduce((n, w) => n + (w.totalAmountReceived ?? 0), 0);
    const goal = wishlists.reduce((n, w) => n + (w.totalGoalAmount ?? 0), 0);
    const givers = wishlists.reduce((n, w) => n + (w.totalContributors ?? 0), 0);
    const completed = wishlists.filter((w) => w.isCompleted).length;
    const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    const across = `${total} ${total === 1 ? "wishlist" : "wishlists"}`;

    const counts = [
        { label: "Wishlists", value: String(total), desktopOnly: true },
        { label: "Completed", value: `${completed}/${total}` },
        { label: givers === 1 ? "Giver" : "Givers", value: String(givers) },
    ];

    return (
        <section aria-label="Wishlists summary" className="mb-6 flex items-stretch rounded-2xl bg-secondary px-5 py-4 lg:border lg:bg-card lg:p-0">
            <div className="flex min-w-0 flex-[1.35] flex-col justify-center lg:flex-[2] lg:p-6">
                <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Total raised</p>
                <p className="truncate text-3xl font-extrabold text-brand-light lg:mt-1 lg:text-4xl dark:text-brand-lime-dark">{formatCurrency(raised)}</p>
                <p className="truncate text-sm text-muted-foreground lg:hidden">{goal > 0 ? `${percent}% of ${formatShortCurrency(goal)} across ${across}` : across}</p>
                {goal > 0 && (
                    <div className="mt-3 hidden items-center gap-3 lg:flex">
                        <Progress value={percent} aria-label={`${percent}% of the combined goal`} className="h-2 max-w-sm flex-1" />
                        <span className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{percent}%</span> of {formatCurrency(goal)} goal</span>
                    </div>
                )}
            </div>

            {/* Phones: the two counts stacked. */}
            <div className="mx-4 w-px bg-border lg:hidden" />
            <div className="flex flex-1 flex-col justify-center gap-2 lg:hidden">
                {counts.filter((c) => !c.desktopOnly).map((c, i) => (
                    <div key={c.label} className={i > 0 ? "border-t pt-2" : undefined}>
                        <p className="text-xl font-extrabold tabular-nums">{c.value}</p>
                        <p className="text-sm font-semibold text-muted-foreground">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Desktop: a column per count. */}
            <dl className="hidden flex-[1.6] divide-x border-l lg:flex">
                {counts.map((c) => (
                    <div key={c.label} className="flex flex-1 flex-col justify-center px-6">
                        <dt className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">{c.label}</dt>
                        <dd className="mt-1 text-2xl font-extrabold tabular-nums">{c.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
