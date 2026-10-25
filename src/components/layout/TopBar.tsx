import { Link, useNavigate } from "react-router-dom";
import { PiListBold, PiSignOutBold, PiUserCircleBold, PiWalletBold } from "react-icons/pi";
import { Brand } from "@/components/Brand";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
                <PiListBold className="size-5" />
            </Button>
            <Link to="/" className="lg:hidden" aria-label="Wishers home">
                <Brand />
            </Link>

            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <NotificationBell />

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Account menu"
                                className="flex items-center gap-2 rounded-full p-0.5 pr-1 outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 sm:pr-3"
                            >
                                <UserAvatar name={user.name} image={user.image} className="size-8" />
                                <span className="hidden max-w-32 truncate text-sm font-semibold sm:inline">{user.name}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex flex-col">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => navigate("/profile")}>
                                <PiUserCircleBold /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate("/wallet")}>
                                <PiWalletBold /> Wallet
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                                <PiSignOutBold /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
