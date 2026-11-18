import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoute";
import GuestRoute from "./utils/GuestRoute";
import VerifyRoute from "./utils/VerifyRoute";
import ScrollToTop from "./utils/ScrollToTop";
import { PageLoader } from "./components/PageLoader";

// AUTHENTICATION PAGES
import Login from "./auth/login";
import Signup from "./auth/signup";
import VerifyEmail from "./auth/verifyEmail";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
import Error from "./pages/error";

// DASHBOARD PAGES (split out of the first download, then fetched in the background once the app is idle)
const pages = {
    home: () => import("./pages/home"),
    wishlists: () => import("./pages/wishlists"),
    wishlistItem: () => import("./pages/wishlists/subPages/WishlistItem"),
    wishItemPage: () => import("./pages/wishlists/subPages/WishItemPage"),
    wallet: () => import("./pages/wallet"),
    bankDetails: () => import("./pages/wallet/subPages/BankDetails"),
    profile: () => import("./pages/profile"),
    referrals: () => import("./pages/profile/subPages/Referrals"),
    help: () => import("./pages/profile/subPages/Help"),
    notifications: () => import("./pages/notifications"),
};

const Home = lazy(pages.home);
const Wishlists = lazy(pages.wishlists);
const WishlistItem = lazy(pages.wishlistItem);
const WishItemPage = lazy(pages.wishItemPage);
const Wallet = lazy(pages.wallet);
const BankDetails = lazy(pages.bankDetails);
const Profile = lazy(pages.profile);
const Referrals = lazy(pages.referrals);
const Help = lazy(pages.help);
const Notifications = lazy(pages.notifications);

// So the first click on a page doesn't wait for its code to download.
function preloadPages() {
    Object.values(pages).forEach((load) => load().catch(() => {}));
}

export default function App() {
    useEffect(() => {
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(preloadPages, { timeout: 3000 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(preloadPages, 1500);
        return () => clearTimeout(id);
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* UNPROTECTED ROUTES (guests only) */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>

                    {/* SIGNED IN, EMAIL NOT YET VERIFIED */}
                    <Route element={<VerifyRoute />}>
                        <Route path="/verify-email" element={<VerifyEmail />} />
                    </Route>

                    {/* PROTECTED ROUTES */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />

                        <Route path="/wishlists" element={<Wishlists />} />
                        <Route path="/wishlists/:id" element={<WishlistItem />} />
                        <Route path="/wishlists/:id/wishes/:wishId" element={<WishItemPage />} />

                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/wallet/bank" element={<BankDetails />} />

                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/referrals" element={<Referrals />} />
                        <Route path="/profile/help" element={<Help />} />

                        <Route path="/notifications" element={<Notifications />} />
                    </Route>

                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
