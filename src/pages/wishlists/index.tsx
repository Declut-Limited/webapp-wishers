import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PiListHeartBold, PiPlusBold, PiRowsBold, PiSquaresFourBold } from "react-icons/pi";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WishlistCard } from "@/components/WishlistCard";
import { WishlistsTable } from "@/components/WishlistsTable";
import { useCreateWishlist } from "@/hooks/useCreateWishlist";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Page, Wishlist } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WishlistFormDialog } from "./components/WishlistFormDialog";
import { WishlistSummary } from "./components/WishlistSummary";

type Filter = "all" | "active" | "completed";

export default function Wishlists() {
    const [params, setParams] = useSearchParams();
    const [formOpen, setFormOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [filter, setFilter] = useState<Filter>("all");
    const [view, setView] = useState<"table" | "grid">(() => (localStorage.getItem("wishers_wishlists_view") === "grid" ? "grid" : "table"));
    useEffect(() => {
        localStorage.setItem("wishers_wishlists_view", view);
    }, [view]);

    const openForm = () => {
        setFormKey((k) => k + 1);
        setFormOpen(true);
    };
    const { createWishlist, checking } = useCreateWishlist(openForm);

    const { data, isPending, error } = useLiveQuery<Page<Wishlist>>("/wishlists/me?limit=50", ["wishlist:update", "wishItem:update"]);
    const all = data?.results ?? [];
    const shown = all.filter((w) => (filter === "all" ? true : filter === "completed" ? w.isCompleted : !w.isCompleted));

    // "New wishlist" from elsewhere (home, after adding bank details) lands here with ?new=1.
    // (useCreateWishlist ignores a second call while one is running.)
    useEffect(() => {
        if (params.get("new") !== "1") return;
        setParams({}, { replace: true });
        createWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <>
            <PageHeader
                title="Wishlists"
                description="Create, share and track your wishlists."
                actions={
                    <Button onClick={createWishlist} disabled={checking} className="font-bold">
                        <PiPlusBold /> {checking ? "Checking…" : "New wishlist"}
                    </Button>
                }
            />

            {all.length > 0 && <WishlistSummary wishlists={all} />}

            {all.length > 0 && (
                <div className="mb-6 flex min-w-0 items-center justify-between gap-3">
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                        <TabsList>
                            <TabsTrigger value="all">All ({all.length})</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="hidden items-center rounded-lg border p-0.5 lg:flex" role="group" aria-label="View">
                        {(["table", "grid"] as const).map((v) => {
                            const Icon = v === "table" ? PiRowsBold : PiSquaresFourBold;
                            return (
                                <Button key={v} variant={view === v ? "secondary" : "ghost"} size="icon" className="size-8" aria-label={`${v} view`} aria-pressed={view === v} onClick={() => setView(v)}>
                                    <Icon />
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {isPending ? (
                <div className="grid grid-cols-[minmax(0,1fr)] gap-3 xl:grid-cols-2">
                    {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
            ) : error ? (
                <p className="py-16 text-center text-muted-foreground">{error.message}</p>
            ) : shown.length === 0 ? (
                <EmptyState
                    icon={PiListHeartBold}
                    title={all.length ? "Nothing here" : "No wishlists yet"}
                    message={all.length ? "No wishlists match this filter." : "Create your first wishlist, add your wishes and share one link with friends and family."}
                    action={!all.length && <Button onClick={createWishlist} disabled={checking} className="font-bold"><PiPlusBold /> New wishlist</Button>}
                    className="rounded-2xl border border-dashed"
                />
            ) : (
                <>
                    {/* Cards on phones and tablets (and desktop grid view); a table on desktop by default. */}
                    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-3 xl:grid-cols-2", view === "table" && "lg:hidden")}>
                        {shown.map((w) => <WishlistCard key={w._id} wishlist={w} />)}
                    </div>
                    {view === "table" && (
                        <div className="hidden overflow-hidden rounded-2xl border bg-card lg:block">
                            <WishlistsTable wishlists={shown} />
                        </div>
                    )}
                </>
            )}

            <WishlistFormDialog key={formKey} open={formOpen} onOpenChange={setFormOpen} />
        </>
    );
}
