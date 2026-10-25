import type { IconType } from "react-icons";
import { PiHouseBold, PiHouseFill, PiListHeartBold, PiListHeartFill, PiUserCircleBold, PiUserCircleFill, PiWalletBold, PiWalletFill } from "react-icons/pi";

export type NavItem = { label: string; to: "/" | "/wishlists" | "/wallet" | "/profile"; icon: IconType; activeIcon: IconType };

// The mobile app's four tabs.
export const NAV_ITEMS: NavItem[] = [
    { label: "Home", to: "/", icon: PiHouseBold, activeIcon: PiHouseFill },
    { label: "Wishlists", to: "/wishlists", icon: PiListHeartBold, activeIcon: PiListHeartFill },
    { label: "Wallet", to: "/wallet", icon: PiWalletBold, activeIcon: PiWalletFill },
    { label: "Profile", to: "/profile", icon: PiUserCircleBold, activeIcon: PiUserCircleFill },
];

