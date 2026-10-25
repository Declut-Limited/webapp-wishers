import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
    success: "bg-brand-mint text-brand-dark dark:bg-brand-dark dark:text-brand-mint",
    settled: "bg-brand-mint text-brand-dark dark:bg-brand-dark dark:text-brand-mint",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    failed: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

// Paid but not yet in the bank shows "Settling"; failed payments show "Failed".
export function TransactionStatus({ tx }: { tx: Transaction }) {
    const key = tx.status !== "success" ? tx.status : tx.settlementStatus;
    const label = tx.status === "failed" ? "Failed" : tx.status === "pending" ? "Pending" : tx.settlementStatus === "settled" ? "Settled" : "Settling";
    return <Badge className={cn("font-bold capitalize", STYLES[key])}>{label}</Badge>;
}
