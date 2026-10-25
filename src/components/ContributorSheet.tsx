import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/UserAvatar";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Contributor } from "@/lib/types";
import { formatCurrency, formatDateFull } from "@/utils/helper";

// A giver's details, in a side panel (the mobile contributor modal).
export function ContributorSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
    const { data: c, isPending } = useLiveQuery<Contributor>(id ? `/contributors/${id}` : null);
    const name = c && (c.isAnonymous || !c.name ? "Anonymous" : c.name);

    const rows = c
        ? [
              { label: "Amount", value: formatCurrency(c.amount ?? 0, 2) },
              { label: "Date", value: formatDateFull(c.createdAt) },
              ...(!c.isAnonymous && c.email ? [{ label: "Email", value: c.email }] : []),
              ...(c.reference ? [{ label: "Reference", value: c.reference }] : []),
          ]
        : [];

    return (
        <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Gift details</SheetTitle>
                    <SheetDescription>Who gave, how much and their note.</SheetDescription>
                </SheetHeader>

                {isPending || !c ? (
                    <div className="space-y-4 p-4">
                        <Skeleton className="mx-auto size-20 rounded-full" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-24" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 px-4 pb-6">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <UserAvatar name={c.isAnonymous ? undefined : c.name} image={c.isAnonymous ? undefined : c.image} className="size-20" />
                            <p className="text-lg font-bold">From {name}</p>
                            <p className="text-3xl font-extrabold text-brand-light dark:text-brand-lime-dark">{formatCurrency(c.amount ?? 0, 2)}</p>
                        </div>

                        {c.message && (
                            <blockquote className="rounded-2xl bg-accent p-4 text-accent-foreground">
                                “{c.message}”
                            </blockquote>
                        )}

                        <dl className="divide-y rounded-2xl border">
                            {rows.map((r) => (
                                <div key={r.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                                    <dt className="text-muted-foreground">{r.label}</dt>
                                    <dd className="truncate text-right font-semibold">{r.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
