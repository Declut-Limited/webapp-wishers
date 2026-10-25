import { useNavigate } from "react-router-dom";
import { PiImageBold } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Wishlist } from "@/lib/types";
import { calculatePercentage, formatCurrency, formatDateShort } from "@/utils/helper";

// Desktop list of wishlists: one row each, sortable at a glance by progress.
export function WishlistsTable({ wishlists, compact }: { wishlists: Wishlist[]; compact?: boolean }) {
    const navigate = useNavigate();

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Wishlist</TableHead>
                    <TableHead className="w-[30%]">Progress</TableHead>
                    <TableHead className="text-right">Givers</TableHead>
                    {!compact && <TableHead className="text-right">Wishes</TableHead>}
                    {!compact && <TableHead>Created</TableHead>}
                    <TableHead className="pr-5 text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {wishlists.map((w) => {
                    const percent = calculatePercentage(w.totalAmountReceived ?? 0, w.totalGoalAmount ?? 0);
                    const open = () => navigate(`/wishlists/${w._id}`);
                    return (
                        <TableRow key={w._id} onClick={open} className="cursor-pointer">
                            <TableCell className="pl-5">
                                <button type="button" onClick={open} className="flex items-center gap-3 text-left focus-visible:underline focus-visible:outline-none">
                                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                                        {w.image ? <img src={w.image} alt="" loading="lazy" className="size-full object-cover" /> : <PiImageBold aria-hidden />}
                                    </span>
                                    <span className="max-w-64 truncate font-semibold">{w.title}</span>
                                </button>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Progress value={percent} aria-label={`${percent}% raised`} className="h-1.5 flex-1" />
                                    <span className="w-10 shrink-0 text-right text-xs font-semibold">{percent}%</span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    <span className="font-bold text-foreground">{formatCurrency(w.totalAmountReceived ?? 0)}</span> of {formatCurrency(w.totalGoalAmount ?? 0)}
                                </p>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{w.totalContributors ?? 0}</TableCell>
                            {!compact && <TableCell className="text-right tabular-nums">{w.totalWishItems ?? 0}</TableCell>}
                            {!compact && <TableCell className="text-muted-foreground">{formatDateShort(w.createdAt)}</TableCell>}
                            <TableCell className="pr-5 text-right">
                                {w.isCompleted ? (
                                    <Badge className="bg-brand-lime font-bold text-brand-dark">Completed</Badge>
                                ) : (
                                    <Badge variant="secondary" className="font-bold">Active</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
