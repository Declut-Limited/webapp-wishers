import { useNavigate } from "react-router-dom";
import { PiImageBold } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WishItem } from "@/lib/types";
import { calculatePercentage, formatCurrency } from "@/utils/helper";

// Desktop list of a wishlist's wishes.
export function WishesTable({ wishlistId, wishes }: { wishlistId: string; wishes: WishItem[] }) {
    const navigate = useNavigate();

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Wish</TableHead>
                    <TableHead className="w-[32%]">Progress</TableHead>
                    <TableHead className="text-right">Goal</TableHead>
                    <TableHead className="text-right">Givers</TableHead>
                    <TableHead className="pr-5 text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {wishes.map((w) => {
                    const percent = calculatePercentage(w.amountReceived ?? 0, w.goalAmount ?? 0);
                    const open = () => navigate(`/wishlists/${wishlistId}/wishes/${w._id}`);
                    return (
                        <TableRow key={w._id} onClick={open} className="cursor-pointer">
                            <TableCell className="pl-5">
                                <button type="button" onClick={open} className="flex items-center gap-3 text-left focus-visible:underline focus-visible:outline-none">
                                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                                        {w.images?.[0] ? <img src={w.images[0]} alt="" loading="lazy" className="size-full object-cover" /> : <PiImageBold aria-hidden />}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block max-w-72 truncate font-semibold">{w.title}</span>
                                        {w.description && <span className="block max-w-72 truncate text-xs text-muted-foreground">{w.description}</span>}
                                    </span>
                                </button>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Progress value={percent} aria-label={`${percent}% raised`} className="h-1.5 flex-1" />
                                    <span className="w-10 shrink-0 text-right text-xs font-semibold">{percent}%</span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    <span className="font-bold text-foreground">{formatCurrency(w.amountReceived ?? 0)}</span> raised
                                </p>
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(w.goalAmount ?? 0)}</TableCell>
                            <TableCell className="text-right tabular-nums">{w.contributorCount ?? 0}</TableCell>
                            <TableCell className="pr-5 text-right">
                                {w.isCompleted ? <Badge className="bg-brand-lime font-bold text-brand-dark">Completed</Badge> : <Badge variant="secondary" className="font-bold">Open</Badge>}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
