import { Link, NavLink, useNavigate } from "react-router-dom";
import { PiPlusBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav";


function NavItem({ to, label, icon: Icon, activeIcon, end, onNavigate }: { to: string; label: string; icon: IconType; activeIcon?: IconType; end?: boolean; onNavigate?: () => void }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
            }
        >
            {({ isActive }) => {
                const Shown = isActive && activeIcon ? activeIcon : Icon;
                return (
                    <>
                        <Shown className={cn("size-[18px]", isActive && "text-primary")} aria-hidden />
                        {label}
                    </>
                );
            }}
        </NavLink>
    );
}

// The sidebar's contents: fixed on desktop, inside the menu drawer below that.
export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
    const navigate = useNavigate();

    return (
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
            <Link to="/" onClick={onNavigate} aria-label="Wishers home" className="px-2 pt-1">
                <Brand />
            </Link>

            <Button className="w-full justify-start font-bold" onClick={() => { onNavigate?.(); navigate("/wishlists?new=1"); }}>
                <PiPlusBold aria-hidden /> New wishlist
            </Button>

            <nav aria-label="Primary" className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} activeIcon={item.activeIcon} end={item.to === "/"} onNavigate={onNavigate} />
                ))}
            </nav>

        </div>
    );
}
