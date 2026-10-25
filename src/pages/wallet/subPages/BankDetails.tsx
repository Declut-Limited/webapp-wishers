import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PiBankBold, PiCheckCircleFill, PiWarningCircleFill } from "react-icons/pi";
import { toast } from "sonner";
import { BackLink } from "@/components/BackLink";
import { BankSelect } from "@/components/form/BankSelect";
import { FormField } from "@/components/form/FormField";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import type { Bank, BankAccount } from "@/lib/types";
import { resolveBankAccount, saveBankAccount } from "@/services/bankService";
import { errorMessage } from "@/utils/validation";

const NUBAN_LENGTH = 10;

export default function BankDetails() {
    const navigate = useNavigate();
    // next=createWishlist: sent here from a "new wishlist" button; continue to the form after saving.
    const [params] = useSearchParams();
    const next = params.get("next");

    const banks = useLiveQuery<Bank[]>("/banks");
    const saved = useLiveQuery<BankAccount | null>("/bank-accounts/me");

    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [lookup, setLookup] = useState<{ key: string; name: string; error: string } | null>(null);
    const [saving, setSaving] = useState(false);

    // Start from the saved account when changing it (once, when it first loads).
    const [prefilled, setPrefilled] = useState(false);
    if (!prefilled && saved.data !== undefined) {
        setPrefilled(true);
        if (saved.data) {
            setBankCode(saved.data.bankCode);
            setAccountNumber(saved.data.accountNumber);
        }
    }

    // Look the name up with the bank once there are 10 digits.
    const lookupKey = bankCode && accountNumber.length === NUBAN_LENGTH ? `${bankCode}:${accountNumber}` : "";
    useEffect(() => {
        if (!lookupKey) return;
        let active = true;
        resolveBankAccount(bankCode, accountNumber)
            .then((res) => active && setLookup({ key: lookupKey, name: res.accountName, error: "" }))
            .catch((err) => active && setLookup({ key: lookupKey, name: "", error: errorMessage(err, "Could not verify this account") }));
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lookupKey]);

    const resolved = !lookupKey
        ? { loading: false, name: "", error: "" }
        : lookup?.key === lookupKey
          ? { loading: false, name: lookup.name, error: lookup.error }
          : { loading: true, name: "", error: "" };

    const isChange = !!saved.data;
    const unchanged = isChange && saved.data!.bankCode === bankCode && saved.data!.accountNumber === accountNumber;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!bankCode) return toast.error("Select your bank");
        if (accountNumber.length !== NUBAN_LENGTH) return toast.error(`Account number must be ${NUBAN_LENGTH} digits`);
        if (resolved.loading) return toast.error("Still checking your account, one moment");
        if (!resolved.name) return toast.error(resolved.error || "We couldn't verify this account");
        if (unchanged) return toast.warning("That's already your saved account");

        setSaving(true);
        try {
            await saveBankAccount({ bankCode, accountNumber }, isChange);
            toast.success(isChange ? "Bank details changed" : "Bank details saved");
            navigate(next === "createWishlist" ? "/wishlists?new=1" : "/wallet", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not save your bank details"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-xl">
            <BackLink to="/wallet" label="Wallet" />
            <PageHeader
                title={isChange ? "Change bank details" : "Add bank details"}
                description="Gifts on your wishlists are paid straight into this account."
            />

            {saved.isPending || banks.isPending ? (
                <Skeleton className="h-80 rounded-2xl" />
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border bg-card p-6" noValidate>
                    <div className="flex items-center gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
                        <PiBankBold className="size-6 shrink-0" aria-hidden />
                        The account name must match the one the bank has; we check it for you.
                    </div>

                    <FormField id="bank" label="Bank">
                        <BankSelect id="bank" banks={banks.data ?? []} value={bankCode} onChange={setBankCode} />
                    </FormField>

                    <FormField id="accountNumber" label="Account number">
                        <Input
                            id="accountNumber"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="10-digit account number"
                            maxLength={NUBAN_LENGTH}
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                            className="h-11 font-mono tracking-wider"
                        />
                    </FormField>

                    <FormField id="accountName" label="Account name">
                        <div
                            id="accountName"
                            aria-live="polite"
                            className="flex h-11 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm"
                        >
                            {resolved.loading ? (
                                <span className="text-muted-foreground">Checking with your bank…</span>
                            ) : resolved.name ? (
                                <><PiCheckCircleFill className="text-primary" aria-hidden /><span className="font-semibold">{resolved.name}</span></>
                            ) : resolved.error ? (
                                <><PiWarningCircleFill className="text-destructive" aria-hidden /><span className="text-destructive">{resolved.error}</span></>
                            ) : (
                                <span className="text-muted-foreground">Filled in from your bank</span>
                            )}
                        </div>
                    </FormField>

                    <Button type="submit" size="lg" className="h-11 font-bold" disabled={saving || resolved.loading || !resolved.name || unchanged}>
                        {saving ? "Saving…" : isChange ? "Change bank details" : "Save bank details"}
                    </Button>
                </form>
            )}
        </div>
    );
}
