import { PiHandHeartBold } from "react-icons/pi";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/UserAvatar";
import type { Contributor } from "@/lib/types";
import { formatCurrency, timeAgo } from "@/utils/helper";

export function RecentGivers({ givers, loading, error, onShare, onSelect }: { givers: Contributor[]; loading: boolean; error?: string; onShare: () => void; onSelect: (id: string) => void }) {
    return (
        <section aria-labelledby="recent-givers" className="rounded-2xl border bg-card">
            <h2 id="recent-givers" className="px-5 pt-5 pb-2 text-xl font-bold">Recent givers</h2>

            {loading ? (
                <ul className="divide-y">
                    {Array.from({ length: 4 }, (_, i) => (
                        <li key={i} className="flex items-center gap-3 px-5 py-4">
                            <Skeleton className="size-11 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-5 w-20" />
                        </li>
                    ))}
                </ul>
            ) : error ? (
                <p className="px-5 py-10 text-center text-muted-foreground">{error}</p>
            ) : givers.length === 0 ? (
                <EmptyState
                    icon={PiHandHeartBold}
                    title="No givers yet"
                    message="Share a wishlist with friends and family. Every gift you receive will show up here."
                    action={<Button onClick={onShare} className="font-bold">Share a wishlist</Button>}
                />
            ) : (
                <ul className="divide-y">
                    {givers.map((g) => {
                        const name = g.isAnonymous || !g.name ? "an Anonymous" : g.name;
                        return (
                            <li key={g._id}>
                                <button type="button" onClick={() => onSelect(g._id)} className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none">
                                <UserAvatar name={g.isAnonymous ? undefined : g.name} image={g.isAnonymous ? undefined : g.image} className="size-11" />
                                <span className="block min-w-0 flex-1">
                                    <span className="block truncate font-semibold">From {name}</span>
                                    {g.message && <span className="block truncate text-sm text-muted-foreground">{g.message}</span>}
                                </span>
                                <span className="block shrink-0 text-right">
                                    <span className="block font-bold text-brand-light dark:text-brand-lime-dark">{formatCurrency(g.amount ?? 0, 2)}</span>
                                    <span className="block text-xs text-muted-foreground">{timeAgo(g.createdAt)}</span>
                                </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
