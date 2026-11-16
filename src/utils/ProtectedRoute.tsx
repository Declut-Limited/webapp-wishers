import { Suspense, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarBody } from "@/components/layout/AppSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { PageLoader } from "@/components/PageLoader";
import { Splash } from "@/components/Splash";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Signed-in, verified users only, inside the app shell (ClipBay's pattern): a fixed sidebar on desktop (lg+)
// and the same menu sliding out below that; on phones (500px and below) a bottom bar instead, if chosen in Profile.
export default function ProtectedRoute() {
    const { user, restoring } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    if (restoring) return <Splash />;
    if (!user) return <Navigate to="/login" replace />;
    if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

    const bottomNav = user.navLayout === "bottom";

    return (
        <div className="min-h-dvh bg-background">
            <a
                href="#main"
                className="sr-only z-50 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                Skip to content
            </a>

            {/* Desktop sidebar: always open, never collapses. */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
                <SidebarBody />
            </aside>

            {/* Smaller screens: the same menu slides in from the left. */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation</SheetDescription>
                    <SidebarBody onNavigate={() => setMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Phones (500px and below) can swap the menu button for a bottom bar. */}
            {bottomNav && <BottomNav className="min-[501px]:hidden" />}

            <div className="lg:pl-64">
                <TopBar onOpenMenu={() => setMenuOpen(true)} hideMenuOnPhone={bottomNav} />
                <main id="main" className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8", bottomNav && "max-[500px]:pb-28")}>
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

        </div>
    );
}
