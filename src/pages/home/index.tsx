import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BalanceCard } from "@/components/BalanceCard";
import { ContributorSheet } from "@/components/ContributorSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Contributor, Page, Wallet, Wishlist } from "@/lib/types";
import { formatCurrency, greeting, shareLink } from "@/utils/helper";
import { QuickActions } from "./components/QuickActions";
import { RecentGivers } from "./components/RecentGivers";
import { TopWishlistCard } from "./components/TopWishlistCard";

// Exactly the mobile home: balance card, three quick actions, top wishlist, recent givers.
// Featured wishlists are left out, as on mobile (they only show boosted wishlists).
export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [giverId, setGiverId] = useState<string | null>(null);

    const wallet = useLiveQuery<Wallet>("/wallets/me", ["wallet:update", "wishItem:update"]);
    const givers = useLiveQuery<Page<Contributor>>("/contributors?limit=30", ["wishItem:update", "notification"]);
    const mine = useLiveQuery<Page<Wishlist>>("/wishlists/me?limit=50", ["wishlist:update", "wishItem:update"]);

    // Your most active open wishlist: most raised, ties to the one with a goal.
    const topWishlist = [...(mine.data?.results ?? [])]
        .filter((w) => !w.isCompleted)
        .sort((a, b) => (b.totalAmountReceived ?? 0) - (a.totalAmountReceived ?? 0) || (b.totalGoalAmount ?? 0) - (a.totalGoalAmount ?? 0))[0];

    // The wishlists page opens the create dialog (with its bank details check) from ?new=1.
    const handleNew = () => navigate("/wishlists?new=1");

    const handleShare = () => {
        if (!topWishlist?.link) return navigate("/wishlists");
        shareLink(topWishlist.title, topWishlist.link, () => toast.success("Wishlist link copied"));
    };

    const firstName = user?.name?.trim().split(" ")[0];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="font-medium text-muted-foreground">Hi & {greeting()},</p>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{firstName || "there"}</h1>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BalanceCard
                        label="All-time received"
                        value={formatCurrency(wallet.data?.allTimeBalance ?? 0, 2)}
                        stats={[
                            { label: "From gifts", value: formatCurrency(wallet.data?.contributedEarning ?? 0) },
                            { label: "From referrals", value: formatCurrency(wallet.data?.referralEarnings ?? 0) },
                        ]}
                        loading={wallet.isPending}
                    />
                </div>
                <QuickActions onNew={handleNew} onShare={handleShare} onWallet={() => navigate("/wallet")} />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-3">
                <TopWishlistCard wishlist={topWishlist} loading={mine.isPending} onNew={handleNew} />
                <div className="lg:col-span-2">
                    <RecentGivers givers={givers.data?.results ?? []} loading={givers.isPending} error={givers.error?.message} onShare={handleShare} onSelect={setGiverId} />
                </div>
            </div>

            <ContributorSheet id={giverId} onClose={() => setGiverId(null)} />
        </div>
    );
}
