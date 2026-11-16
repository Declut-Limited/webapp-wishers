import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiBankBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { BankAccount } from "@/lib/types";

const seenKey = (userId: string) => `wishers_bank_prompt_${userId}`;

// After sign-up, home asks for bank details: gifts settle straight to the wisher's bank, so nothing can
// be received without them. Shown once per browser session until they're added.
export function BankDetailsPrompt() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const bank = useLiveQuery<BankAccount | null>("/bank-accounts/me");
    const [dismissed, setDismissed] = useState(() => !!user && sessionStorage.getItem(seenKey(user._id)) === "1");

    if (!user) return null;
    const open = bank.isSuccess && !bank.data && !dismissed;

    const dismiss = () => {
        sessionStorage.setItem(seenKey(user._id), "1");
        setDismissed(true);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <span className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-brand-lime text-brand-dark dark:bg-brand-dark dark:text-brand-lime-dark">
                        <PiBankBold className="size-7" aria-hidden />
                    </span>
                    <DialogTitle className="text-xl font-extrabold">Add your bank details</DialogTitle>
                    <DialogDescription>
                        Gifts on your wishlists go straight to your bank account, so add it before you share your first wishlist.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
                    <Button
                        size="lg"
                        className="w-full font-bold"
                        onClick={() => {
                            dismiss();
                            navigate("/wallet/bank");
                        }}
                    >
                        Add bank details
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full font-semibold" onClick={dismiss}>
                        Maybe later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
