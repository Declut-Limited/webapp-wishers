import { Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Splash } from "@/components/Splash";
import { useAuth } from "@/contexts/AuthContext";

// Signed in but email not yet verified (the verify-email call needs the session).
export default function VerifyRoute() {
    const { user, restoring } = useAuth();

    if (restoring) return <Splash />;
    if (!user) return <Navigate to="/login" replace />;
    if (user.emailVerified) return <Navigate to="/" replace />;

    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
