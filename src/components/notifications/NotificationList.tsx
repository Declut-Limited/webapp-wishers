import { PiBellBold, PiChecksBold } from "react-icons/pi";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { api } from "@/lib/api";
import type { AppNotification, Page } from "@/lib/types";
import { cn } from "@/lib/utils";
import { invalidatePaths } from "@/services/wishlistService";
import { timeAgo } from "@/utils/helper";

const refresh = () => invalidatePaths("/notifications");

// In-app notifications (push isn't on web). Used in the bell's popover and on the phone page.
export function NotificationList({ className }: { className?: string }) {
    const { data, isPending, error } = useLiveQuery<Page<AppNotification>>("/notifications?limit=50", ["notification"]);
    const items = data?.results ?? [];
    const unread = items.some((n) => !n.read);

    const markAllRead = async () => {
        try {
            await api("/notifications/read-all", { method: "POST" });
            await refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not mark as read");
        }
    };

    const markRead = async (n: AppNotification) => {
        if (n.read) return;
        await api(`/notifications/${n._id}/read`, { method: "PATCH" }).catch(() => {});
        await refresh();
    };

    return (
        <div className={cn("flex flex-col", className)}>
            <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                <h2 className="font-bold">Notifications</h2>
                <Button variant="ghost" size="sm" onClick={markAllRead} disabled={!unread} className="font-semibold">
                    <PiChecksBold /> Mark all read
                </Button>
            </div>

            {isPending ? (
                <div className="space-y-3 p-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : error ? (
                <p className="p-6 text-center text-sm text-muted-foreground">{error.message}</p>
            ) : items.length === 0 ? (
                <EmptyState icon={PiBellBold} title="You're all caught up" message="Gifts, settlements and updates will show up here." className="py-10" />
            ) : (
                <ul className="divide-y overflow-y-auto">
                    {items.map((n) => (
                        <li key={n._id}>
                            <button
                                type="button"
                                onClick={() => markRead(n)}
                                className={cn("flex w-full gap-3 px-4 py-3 text-left transition hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none", !n.read && "bg-accent/40")}
                            >
                                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} aria-hidden />
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-baseline justify-between gap-2">
                                        <span className={cn("truncate", !n.read && "font-bold")}>{n.title}</span>
                                        <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                                    </span>
                                    <span className="mt-0.5 block text-sm text-muted-foreground">{n.body}</span>
                                    {!n.read && <span className="sr-only">Unread</span>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
