import { NavLink, useNavigate } from "react-router-dom";
import { PiPlusBold } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "./nav";

function Tab({ to, label, icon: Icon, activeIcon: ActiveIcon }: NavItem) {
    return (
        <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
                cn(
                    "flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )
            }
        >
            {({ isActive }) => {
                const Shown = isActive ? ActiveIcon : Icon;
                return (
                    <>
                        <Shown className="size-6" aria-hidden />
                        {label}
                    </>
                );
            }}
        </NavLink>
    );
}

// The bottom-bar layout (chosen in Profile): the four tabs with "New wishlist" in the middle, as on mobile.
export function BottomNav({ className }: { className?: string }) {
    const navigate = useNavigate();
    const [home, wishlists, wallet, profile] = NAV_ITEMS;

    return (
        <nav aria-label="Primary" className={cn("fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur", className)}>
            <div className="mx-auto flex h-18 max-w-xl items-center justify-around px-2">
                <Tab {...home} />
                <Tab {...wishlists} />
                <button
                    type="button"
                    onClick={() => navigate("/wishlists?new=1")}
                    aria-label="New wishlist"
                    className="flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/85 active:translate-y-px outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <PiPlusBold className="size-6" aria-hidden />
                </button>
                <Tab {...wallet} />
                <Tab {...profile} />
            </div>
        </nav>
    );
}
