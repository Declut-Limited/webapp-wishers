import type { IconType } from "react-icons";
import { PiChartLineUpBold, PiEyeBold, PiGiftBold, PiUsersThreeBold } from "react-icons/pi";
import type { Wishlist } from "@/lib/types";

// The mobile wishlist screen's insight tiles: wishes, givers, visitors, and impressions once there are any.
export function WishlistInsights({ wishlist }: { wishlist: Wishlist }) {
    const tiles: { label: string; value: number; icon: IconType; color: string; tint: string }[] = [
        { label: wishlist.totalWishItems === 1 ? "Wish" : "Wishes", value: wishlist.totalWishItems ?? 0, icon: PiGiftBold, color: "#16a34a", tint: "rgba(22,163,74,0.14)" },
        { label: wishlist.totalContributors === 1 ? "Giver" : "Givers", value: wishlist.totalContributors ?? 0, icon: PiUsersThreeBold, color: "#2563eb", tint: "rgba(37,99,235,0.14)" },
        { label: "Visitors", value: wishlist.visitCount ?? 0, icon: PiEyeBold, color: "#7c3aed", tint: "rgba(124,58,237,0.14)" },
        ...((wishlist.impressionCount ?? 0) > 0
            ? [{ label: "Impressions", value: wishlist.impressionCount, icon: PiChartLineUpBold, color: "#d97d55", tint: "rgba(217,125,85,0.15)" }]
            : []),
    ];

    return (
        <dl className="grid grid-cols-3 gap-3 [&:has(>:nth-child(4))]:grid-cols-2 sm:[&:has(>:nth-child(4))]:grid-cols-4">
            {tiles.map(({ label, value, icon: Icon, color, tint }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: tint, color }}>
                        <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <dd className="truncate text-lg leading-tight font-extrabold tabular-nums">{value}</dd>
                        <dt className="truncate text-xs font-semibold text-muted-foreground">{label}</dt>
                    </div>
                </div>
            ))}
        </dl>
    );
}
