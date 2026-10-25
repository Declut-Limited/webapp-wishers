import type { IconType } from "react-icons";
import { PiPlusBold, PiShareFatBold, PiWalletBold } from "react-icons/pi";

type Action = { label: string; icon: IconType; onClick: () => void };

// The mobile home's three quick actions: three across on phones, stacked beside the balance card on desktop.
export function QuickActions({ onNew, onShare, onWallet }: { onNew: () => void; onShare: () => void; onWallet: () => void }) {
    const actions: Action[] = [
        { label: "New wishlist", icon: PiPlusBold, onClick: onNew },
        { label: "Share", icon: PiShareFatBold, onClick: onShare },
        { label: "Wallet", icon: PiWalletBold, onClick: onWallet },
    ];

    return (
        <section aria-label="Quick actions" className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {actions.map(({ label, icon: Icon, onClick }) => (
                <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-secondary px-2 py-3 text-center transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] lg:h-full lg:flex-row lg:gap-3 lg:px-4 lg:text-left"
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-brand-light dark:bg-brand-dark dark:text-brand-lime-dark">
                        <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="truncate text-sm font-bold">{label}</span>
                </button>
            ))}
        </section>
    );
}
