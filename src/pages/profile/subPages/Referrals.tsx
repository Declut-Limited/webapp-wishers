import { useState } from "react";
import { Link } from "react-router-dom";
import { PiBankBold, PiCaretDownBold, PiCopyBold, PiFacebookLogoBold, PiInfo, PiUsersThreeBold, PiWalletBold, PiWhatsappLogoBold } from "react-icons/pi";
import { toast } from "sonner";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { usePaginated } from "@/hooks/usePaginated";
import { useSettings } from "@/hooks/useSettings";
import type { BankAccount, ReferredUser, Wallet } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateShort } from "@/utils/helper";

export default function Referrals() {
    const { user } = useAuth();
    const settings = useSettings();
    const wallet = useLiveQuery<Wallet>("/wallets/me", ["wallet:update"]);
    const bank = useLiveQuery<BankAccount | null>("/bank-accounts/me");

    const code = user?.inviteCode ?? "";
    const inviteLink = `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`;
    const inviteText = `Join Wishers using my referral code "${code}"`;
    const share = settings?.referrerSharePercentage ?? 1;

    const copy = async (text: string, what: string) => {
        await navigator.clipboard.writeText(text);
        toast.success(`${what} copied`);
    };

    const stats = [
        { label: (user?.referralsCount ?? 0) === 1 ? "Friend referred" : "Friends referred", value: String(user?.referralsCount ?? 0), icon: PiUsersThreeBold },
        { label: "Earned", value: wallet.isPending ? "––" : formatCurrency(wallet.data?.referralEarnings ?? 0), icon: PiWalletBold },
    ];

    return (
        <div className="mx-auto max-w-3xl">
            <BackLink to="/profile" label="Profile" />
            <PageHeader title="Refer & Earn" description={`Invite friends to Wishers and earn ${share}% of every gift they receive.`} />

            <section className="relative overflow-hidden rounded-2xl bg-brand-purple p-6 text-white md:p-8">
                <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10" />
                <p className="relative text-xs font-bold tracking-[0.12em] text-white/75 uppercase">Your referral code</p>
                <div className="relative mt-2 flex flex-wrap items-center gap-3">
                    <p className="font-mono text-3xl font-extrabold tracking-widest md:text-4xl">{code || "––––"}</p>
                    <Button variant="secondary" size="sm" onClick={() => copy(code, "Code")} disabled={!code} className="font-bold"><PiCopyBold /> Copy code</Button>
                </div>

                <div className="relative mt-6 flex flex-wrap gap-2">
                    <Button onClick={() => copy(inviteLink, "Invite link")} disabled={!code} className="bg-white font-bold text-brand-purple hover:bg-white/90"><PiCopyBold /> Copy invite link</Button>
                    <Button asChild variant="secondary" className="font-bold">
                        <a href={`https://wa.me/?text=${encodeURIComponent(`${inviteText}\n${inviteLink}`)}`} target="_blank" rel="noreferrer"><PiWhatsappLogoBold /> WhatsApp</a>
                    </Button>
                    <Button asChild variant="secondary" className="font-bold">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(inviteText)}`} target="_blank" rel="noreferrer"><PiFacebookLogoBold /> Facebook</a>
                    </Button>
                </div>
            </section>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
                        <span className="flex size-12 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/30 dark:text-white"><Icon className="size-6" aria-hidden /></span>
                        <div>
                            <dt className="text-sm text-muted-foreground">{label}</dt>
                            <dd className="text-2xl font-extrabold">{value}</dd>
                        </div>
                    </div>
                ))}
            </dl>

            {/* Paystack can't send a subaccount under ₦100, so smaller per-gift shares are never paid (api-wishers split.util). */}
            {share > 0 && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-orange-50 px-4 py-2.5 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                    <PiInfo className="mt-0.5 size-5 shrink-0" aria-hidden />
                    <p className="min-w-0 flex-1 text-sm font-medium">
                        Referral bonuses are paid per gift, and only when your {share}% of that gift is ₦100 or more.
                    </p>
                </div>
            )}

            <ReferralsList count={user?.referralsCount ?? 0} />

            {/* The referrer's share only goes out when they have a bank account to receive it. */}
            {!bank.isPending && !bank.data && (
                <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
                    <PiBankBold className="size-6 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                    <p className="min-w-0 flex-1 text-sm">Add your bank details to receive referral earnings.</p>
                    <Button asChild size="sm" className="font-bold"><Link to="/wallet/bank">Add bank details</Link></Button>
                </div>
            )}

            <section className="mt-6 rounded-2xl border bg-card p-6">
                <h2 className="mb-3 text-lg font-bold">How it works</h2>
                <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                    <li>Share your code or invite link with friends.</li>
                    <li>They sign up with your code and create wishlists.</li>
                    <li>Each time they receive a gift, {share}% of it is paid to your bank account.</li>
                </ol>
            </section>
        </div>
    );
}

// Collapsed by default, 8 at a time. The heading shows the API's total, not just what's loaded.
function ReferralsList({ count }: { count: number }) {
    const [open, setOpen] = useState(false);
    const referrals = usePaginated<ReferredUser>("/users/me/referrals", 8);
    const total = referrals.data?.pages[0]?.total ?? count;

    return (
        <section className="mt-6 rounded-2xl border bg-card">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex min-h-11 w-full items-center justify-between gap-4 p-5 text-left"
            >
                <span className="text-lg font-bold">Your referrals ({total})</span>
                <PiCaretDownBold className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
            </button>

            {open && (
                <div className="border-t px-5 pb-5">
                    {referrals.isPending ? (
                        <div className="space-y-3 pt-4">
                            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                        </div>
                    ) : referrals.isError ? (
                        <p className="pt-4 text-sm text-muted-foreground">Couldn't load your referrals. Try again shortly.</p>
                    ) : !referrals.items.length ? (
                        <p className="pt-4 text-sm text-muted-foreground">No one has signed up with your code yet.</p>
                    ) : (
                        <>
                            <ul className="divide-y">
                                {referrals.items.map((r) => (
                                    <li key={r._id} className="flex items-center gap-3 py-3">
                                        <Avatar className="size-10">
                                            {r.image && <AvatarImage src={r.image} alt={`${r.name}'s photo`} className="object-cover" />}
                                            <AvatarFallback className="bg-brand-mint font-semibold text-brand-dark">{initials(r.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{r.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{r.email}</p>
                                        </div>
                                        {r.createdAt && <span className="shrink-0 text-xs text-muted-foreground">{formatDateShort(r.createdAt)}</span>}
                                    </li>
                                ))}
                            </ul>
                            {referrals.hasNextPage && (
                                <div className="flex justify-center pt-2">
                                    <Button variant="ghost" onClick={() => referrals.fetchNextPage()} disabled={referrals.isFetchingNextPage} className="font-bold">
                                        {referrals.isFetchingNextPage ? "Loading…" : "See more"}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </section>
    );
}

function initials(name: string) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "W";
}
