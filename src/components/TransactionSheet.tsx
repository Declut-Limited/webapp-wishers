import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDateFull, transactionTitle } from "@/utils/helper";
import { TransactionStatus } from "./TransactionStatus";

// A transaction's details, in a side panel (the mobile transaction details modal).
export function TransactionSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
    const { data: tx, isPending } = useLiveQuery<Transaction>(id ? `/transactions/${id}` : null, ["wallet:update"]);

    const rows = tx
        ? [
              { label: "Type", value: tx.type === "referral_earning" ? "Referral earning" : "Gift" },
              ...(tx.giftAmount !== undefined && tx.giftAmount !== tx.amount ? [{ label: "Gift amount", value: formatCurrency(tx.giftAmount, 2) }] : []),
              { label: "Charges", value: formatCurrency(tx.charges ?? 0, 2) },
              { label: "Paid", value: formatDateFull(tx.paidAt ?? tx.createdAt) },
              ...(tx.settledAt ? [{ label: "Settled", value: formatDateFull(tx.settledAt) }] : []),
              ...(tx.receiver?.bankName ? [{ label: "Paid into", value: `${tx.receiver.bankName} · ${tx.receiver.accountNumber ?? ""}` }] : []),
              ...(tx.receiver?.accountName ? [{ label: "Account name", value: tx.receiver.accountName }] : []),
              ...(tx.reference ? [{ label: "Reference", value: tx.reference }] : []),
          ]
        : [];

    return (
        <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Transaction details</SheetTitle>
                    <SheetDescription>Payment and settlement to your bank.</SheetDescription>
                </SheetHeader>

                {isPending || !tx ? (
                    <div className="space-y-4 p-4"><Skeleton className="h-24" /><Skeleton className="h-60" /></div>
                ) : (
                    <div className="flex flex-col gap-6 px-4 pb-6">
                        <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary p-6 text-center">
                            <p className="font-semibold text-muted-foreground">{transactionTitle(tx)}</p>
                            <p className="text-3xl font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(tx.amount ?? 0, 2)}</p>
                            <TransactionStatus tx={tx} />
                        </div>
                        <dl className="divide-y rounded-2xl border">
                            {rows.map((r) => (
                                <div key={r.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                                    <dt className="shrink-0 text-muted-foreground">{r.label}</dt>
                                    <dd className="truncate text-right font-semibold" title={String(r.value)}>{r.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
