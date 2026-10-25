import { Link } from "react-router-dom";
import { PiBellBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { NotificationList } from "./NotificationList";

// Unread badge; a dropdown on desktop, its own page on phones.
export function NotificationBell() {
    const isMobile = useIsMobile();
    const { data } = useLiveQuery<{ count: number }>("/notifications/unread-count", ["notification"]);
    const count = data?.count ?? 0;
    const label = count ? `Notifications, ${count} unread` : "Notifications";

    const icon = (
        <span className="relative">
            <PiBellBold className="size-5" />
            {count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {count >= 10 ? "9+" : count}
                </span>
            )}
        </span>
    );

    if (isMobile) {
        return (
            <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications" aria-label={label}>{icon}</Link>
            </Button>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={label}>{icon}</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
                <NotificationList className="max-h-[70svh]" />
            </PopoverContent>
        </Popover>
    );
}
