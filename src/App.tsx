import { lazy, Suspense } from "react";
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

// DASHBOARD PAGES (loaded on first visit)
const Home = lazy(() => import("./pages/home"));
const Wishlists = lazy(() => import("./pages/wishlists"));
const WishlistItem = lazy(() => import("./pages/wishlists/subPages/WishlistItem"));
const WishItemPage = lazy(() => import("./pages/wishlists/subPages/WishItemPage"));
const Wallet = lazy(() => import("./pages/wallet"));
const BankDetails = lazy(() => import("./pages/wallet/subPages/BankDetails"));
const Profile = lazy(() => import("./pages/profile"));
const Referrals = lazy(() => import("./pages/profile/subPages/Referrals"));
const Help = lazy(() => import("./pages/profile/subPages/Help"));
const Notifications = lazy(() => import("./pages/notifications"));

export default function App() {
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
