import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { BankAccount, Page, Wishlist } from "@/lib/types";
import { useSettings } from "./useSettings";

// Every "new wishlist" goes through here, as on mobile. Gifts settle straight to the wisher's bank,
// so without bank details they're sent to add them first, then back to the form.
// A quick count also tells a user at the limit before they fill the form (the API enforces it anyway).
export function useCreateWishlist(openForm: () => void) {
    const navigate = useNavigate();
    const settings = useSettings();
    const [checking, setChecking] = useState(false);
    const busy = useRef(false);

    const createWishlist = async () => {
        if (busy.current) return;
        busy.current = true;
        setChecking(true);
        try {
            const [bank, page] = await Promise.all([
                api<BankAccount | null>("/bank-accounts/me"),
                api<Page<Wishlist>>("/wishlists/me?limit=1"),
            ]);
            if (!bank) {
                toast.warning("Add your bank details first", { description: "So the gifts on your wishlist can reach you" });
                return navigate("/wallet/bank?next=createWishlist");
            }
            const limit = settings?.wishlistCreationLimit;
            if (limit && page.total !== undefined && page.total >= limit) {
                return toast.error(`You cannot create more than ${limit} wishlists`);
            }
            openForm();
        } catch {
            // offline or a failed check: open the form; the server still enforces its rules
            openForm();
        } finally {
            busy.current = false;
            setChecking(false);
        }
    };

    return { createWishlist, checking };
}
