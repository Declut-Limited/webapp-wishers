import { useState } from "react";
import { PiInfo } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BalanceCard } from "@/components/BalanceCard";
import { ContributorSheet } from "@/components/ContributorSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { useSettings } from "@/hooks/useSettings";
import type { Contributor, Page, Wallet, Wishlist } from "@/lib/types";
import { formatCurrency, greeting, shareLink } from "@/utils/helper";
import { BankDetailsPrompt } from "./components/BankDetailsPrompt";
import { QuickActions } from "./components/QuickActions";
import { RecentGivers } from "./components/RecentGivers";
import { TopWishlistCard } from "./components/TopWishlistCard";

// Exactly the mobile home: balance card, three quick actions, top wishlist, recent givers.
// Featured wishlists are left out, as on mobile (they only show boosted wishlists).
export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const settings = useSettings();
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
        // Nothing to give towards yet: add a wish before sharing.
        if (!topWishlist.totalWishItems) {
            toast.warning("Add a wish first", { description: "An empty wishlist can't be shared yet" });
            return navigate(`/wishlists/${topWishlist._id}`);
        }
        shareLink(topWishlist.title, topWishlist.link, () => toast.success("Wishlist link copied"));
    };

    const firstName = user?.name?.trim().split(" ")[0];
    // Everything that isn't the wisher's share (Wishers' cut plus any referrer's).
    const fee = settings ? Math.round((100 - settings.wisherSharePercentage) * 100) / 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="font-medium text-muted-foreground">Hi & {greeting()},</p>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{firstName || "there"}</h1>
            </div>

            {/* Explains why received amounts are a little under what givers sent. */}
            {fee > 0 && (
                <div className="flex items-start gap-3 rounded-2xl bg-orange-50 px-4 py-2.5 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                    <PiInfo className="mt-0.5 size-5 shrink-0" aria-hidden />
                    <p className="min-w-0 flex-1 text-sm font-medium">Wishers takes {fee}% of every gift you receive.</p>
                </div>
            )}

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
            <BankDetailsPrompt />
        </div>
    );
}
