import type { IconType } from "react-icons";
import { PiHouse, PiHouseBold, PiHouseFill, PiListHeart, PiListHeartBold, PiListHeartFill, PiUserCircle, PiUserCircleBold, PiUserCircleFill, PiWallet, PiWalletBold, PiWalletFill } from "react-icons/pi";

// barIcon: the bottom bar's lighter (regular-weight) icon; the sidebar keeps the bold one.
export type NavItem = { label: string; to: "/" | "/wishlists" | "/wallet" | "/profile"; icon: IconType; barIcon: IconType; activeIcon: IconType };

// The mobile app's four tabs.
export const NAV_ITEMS: NavItem[] = [
    { label: "Home", to: "/", icon: PiHouseBold, barIcon: PiHouse, activeIcon: PiHouseFill },
    { label: "Wishlists", to: "/wishlists", icon: PiListHeartBold, barIcon: PiListHeart, activeIcon: PiListHeartFill },
    { label: "Wallet", to: "/wallet", icon: PiWalletBold, barIcon: PiWallet, activeIcon: PiWalletFill },
    { label: "Profile", to: "/profile", icon: PiUserCircleBold, barIcon: PiUserCircle, activeIcon: PiUserCircleFill },
];
