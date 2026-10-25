import { api } from "@/lib/api";
import type { BankAccount } from "@/lib/types";
import { invalidatePaths } from "./wishlistService";

// The account holder's name as the bank has it (Paystack lookup).
export const resolveBankAccount = (bankCode: string, accountNumber: string) =>
    api<{ accountName: string }>(`/banks/resolve?bankCode=${encodeURIComponent(bankCode)}&accountNumber=${encodeURIComponent(accountNumber)}`);

// First save creates the user's Paystack subaccount; a change updates the same one.
// Bank details can't be deleted, only changed (same as mobile).
export async function saveBankAccount(data: { bankCode: string; accountNumber: string }, isChange: boolean) {
    const saved = isChange
        ? await api<BankAccount>("/bank-accounts/me", { method: "PATCH", body: data })
        : await api<BankAccount>("/bank-accounts", { method: "POST", body: data });
    await invalidatePaths("/bank-accounts");
    return saved;
}
