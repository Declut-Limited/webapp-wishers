import { useState } from "react";
import { Link } from "react-router-dom";
import { PiBankBold, PiInfoBold, PiPencilSimpleBold, PiPlusBold, PiReceiptBold } from "react-icons/pi";
import { BalanceCard } from "@/components/BalanceCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { TransactionSheet } from "@/components/TransactionSheet";
import { TransactionStatus } from "@/components/TransactionStatus";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { usePaginated } from "@/hooks/usePaginated";
import type { BankAccount, Transaction, TransactionType, Wallet as WalletType } from "@/lib/types";
import { formatCurrency, formatDateFull, transactionTitle } from "@/utils/helper";

type Filter = "all" | TransactionType;

const EMPTY: Record<Filter, string> = { all: "No transactions yet", contribution: "No gifts received yet", referral_earning: "No referral earnings yet" };

export default function Wallet() {
    const [filter, setFilter] = useState<Filter>("all");
    const [txId, setTxId] = useState<string | null>(null);

    const wallet = useLiveQuery<WalletType>("/wallets/me", ["wallet:update", "wishItem:update"]);
    const bank = useLiveQuery<BankAccount | null>("/bank-accounts/me");
    const txs = usePaginated<Transaction>(`/transactions${filter !== "all" ? `?type=${filter}` : ""}`, 25, ["wallet:update"]);

    const walletStats = [
        { label: "Pending balance", value: formatCurrency(wallet.data?.pendingBalance ?? 0) },
        { label: "Settled balance", value: formatCurrency(wallet.data?.settledBalance ?? 0) },
        { label: "Referral earnings", value: formatCurrency(wallet.data?.referralEarnings ?? 0) },
    ];

    return (
        <>
            <PageHeader title="Wallet" />

            {/* Phones and tablets: the mobile wallet's card and payout note. */}
            <div className="lg:hidden">
                <BalanceCard
                    label="Total earned"
                    value={formatCurrency(wallet.data?.allTimeBalance ?? 0)}
                    stats={walletStats}
                    loading={wallet.isPending}
                />
                <p className="mt-3 mb-6 flex items-start gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-muted-foreground">
                    <PiInfoBold className="mt-0.5 size-4 shrink-0" aria-hidden />
                    Gifts and referral earnings are paid straight into your bank account, usually within 24 hours.
                </p>
            </div>

            {/* Desktop: the same figures as four cards, total earned in the brand green. */}
            <dl aria-label="Balance" className="mb-3 hidden grid-cols-4 gap-4 lg:grid">
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-light to-brand-dark p-5 text-white">
                    <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full border-12 border-white/8" />
                    <dt className="relative text-sm font-semibold text-white/80">Total earned</dt>
                    <dd className="relative mt-2 truncate text-[1.75rem] leading-tight font-extrabold">{wallet.isPending ? "––" : formatCurrency(wallet.data?.allTimeBalance ?? 0)}</dd>
                </div>
                {walletStats.map((s) => (
                    <div key={s.label} className="rounded-2xl border bg-card p-5">
                        <dt className="text-sm font-semibold text-muted-foreground">{s.label}</dt>
                        <dd className="mt-2 truncate text-[1.75rem] leading-tight font-extrabold tabular-nums">{wallet.isPending ? "––" : s.value}</dd>
                    </div>
                ))}
            </dl>
            <p className="mb-6 hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
                <PiInfoBold className="size-4 shrink-0" aria-hidden />
                Gifts and referral earnings are paid straight into your bank account, usually within 24 hours.
            </p>

            {/* Phones: payout account, then transactions. Desktop: transactions with the account beside them. */}
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section aria-labelledby="bank" className="flex flex-col gap-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-24 lg:order-2 lg:rounded-2xl">
                    <h2 id="bank" className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Payout account</h2>
                    {bank.isPending ? (
                        <Skeleton className="mt-4 h-24" />
                    ) : bank.data ? (
                        <>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground">
                                    {bank.data.logoUrl ? <img src={bank.data.logoUrl} alt="" className="size-full object-cover" /> : <PiBankBold className="size-6" aria-hidden />}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-bold">{bank.data.accountName}</p>
                                    <p className="truncate text-sm text-muted-foreground">{bank.data.bankName} · {bank.data.maskedAccountNumber || bank.data.accountNumber}</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild className="mt-auto font-bold">
                                <Link to="/wallet/bank"><PiPencilSimpleBold /> Change bank details</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="mt-3 text-sm text-muted-foreground">Add the bank account your gifts should be paid into. You need one before creating a wishlist.</p>
                            <Button asChild className="mt-auto font-bold">
                                <Link to="/wallet/bank"><PiPlusBold /> Add bank details</Link>
                            </Button>
                        </>
                    )}
                </section>

            <section aria-labelledby="transactions" className="min-w-0 lg:order-1">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 id="transactions" className="text-xl font-extrabold lg:text-base lg:font-bold">Transactions</h2>
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="contribution">Gifts</TabsTrigger>
                            <TabsTrigger value="referral_earning">Referrals</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {txs.isPending ? (
                    <Skeleton className="h-64 rounded-2xl" />
                ) : txs.error ? (
                    <p className="py-12 text-center text-muted-foreground">{txs.error.message}</p>
                ) : txs.items.length === 0 ? (
                    <EmptyState icon={PiReceiptBold} title={EMPTY[filter]} message="Gifts and referral earnings show up here as they come in." className="rounded-2xl border border-dashed" />
                ) : (
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-5">Description</TableHead>
                                    <TableHead className="hidden xl:table-cell">Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="hidden xl:table-cell">Reference</TableHead>
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="pr-5 text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {txs.items.map((tx) => (
                                    <TableRow key={tx._id} onClick={() => setTxId(tx._id)} className="cursor-pointer">
                                        <TableCell className="max-w-56 pl-5">
                                            <button type="button" onClick={() => setTxId(tx._id)} className="block w-full truncate text-left font-semibold focus-visible:underline focus-visible:outline-none">
                                                {transactionTitle(tx)}
                                            </button>
                                            <span className="text-xs text-muted-foreground md:hidden">{formatDateFull(tx.paidAt ?? tx.createdAt)}</span>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">{tx.type === "referral_earning" ? "Referral" : "Gift"}</TableCell>
                                        <TableCell className="hidden text-muted-foreground md:table-cell">{formatDateFull(tx.paidAt ?? tx.createdAt)}</TableCell>
                                        <TableCell className="hidden max-w-36 truncate font-mono text-xs text-muted-foreground xl:table-cell">{tx.reference ?? "—"}</TableCell>
                                        <TableCell className="hidden sm:table-cell"><TransactionStatus tx={tx} /></TableCell>
                                        <TableCell className="pr-5 text-right font-bold text-brand-light dark:text-brand-lime-dark">{formatCurrency(tx.amount ?? 0, 2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {txs.hasNextPage && (
                            <div className="border-t p-3 text-center">
                                <Button variant="ghost" onClick={() => txs.fetchNextPage()} disabled={txs.isFetchingNextPage} className="font-bold">
                                    {txs.isFetchingNextPage ? "Loading…" : "Load more"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </section>
            </div>

            <TransactionSheet id={txId} onClose={() => setTxId(null)} />
        </>
    );
}
