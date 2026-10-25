// Same formats as app-wishers utils/helpers.ts.

import type { Transaction } from "@/lib/types";

export const transactionTitle = (tx: Transaction) => tx.description || (tx.type === "referral_earning" ? "Referral earning" : "Gift received");

export function formatCurrency(amount: number, dec = 0) {
    return "₦" + Number(amount || 0).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatShortCurrency(amount: number): string {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
    return `₦${amount}`;
}

export function calculatePercentage(current: number, target: number): number {
    if (!target) return 0;
    const percentage = (current / target) * 100;
    return percentage >= 100 ? 100 : Number(percentage.toFixed(percentage % 1 === 0 ? 0 : 1));
}

// "25 Oct 2026, 09:30 pm"
export function formatDateFull(dateString?: string): string {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

// "25 Oct 2026"
export function formatDateShort(dateString?: string): string {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// "Just now", "5 mins ago", "Yesterday", "Last Tue", "3 weeks ago"...
export function timeAgo(dateString: string): string {
    const target = new Date(dateString);
    const minutes = Math.floor((Date.now() - target.getTime()) / 60_000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    const plural = (n: number, unit: string) => `${n} ${unit}${n > 1 ? "s" : ""} ago`;

    if (minutes < 1) return "Just now";
    if (minutes < 60) return plural(minutes, "min");
    if (hours < 24) return plural(hours, "hr");
    if (days === 1) return "Yesterday";
    if (days < 7) return `Last ${target.toLocaleDateString("en-GB", { weekday: "short" })}`;
    if (weeks < 4) return plural(weeks, "week");
    if (months < 12) return plural(Math.max(months, 1), "month");
    return plural(years, "year");
}

export function greeting() {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

// Native share sheet where there is one (phones), otherwise copy the link.
export async function shareLink(title: string, url: string, onCopied: () => void) {
    const text = `Check my Wishlist, and help me achieve it:\n${title}`;
    if (navigator.share) {
        try {
            await navigator.share({ title: "Share Wishlist", text, url });
        } catch {
            // share sheet dismissed
        }
        return;
    }
    await navigator.clipboard.writeText(url);
    onCopied();
}
