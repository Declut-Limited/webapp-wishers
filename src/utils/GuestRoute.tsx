import { Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Splash } from "@/components/Splash";
import { useAuth } from "@/contexts/AuthContext";

// Guests only (login, sign-up, password reset); signed-in users go home, or to verify their email first.
export default function GuestRoute() {
    const { user, restoring } = useAuth();

    if (restoring) return <Splash />;
    if (user) return <Navigate to={user.emailVerified ? "/" : "/verify-email"} replace />;

    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
