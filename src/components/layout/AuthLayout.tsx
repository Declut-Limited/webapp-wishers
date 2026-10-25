import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

// Centred auth screens (login, sign-up, verify, password reset), light and dark like the app.
export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-secondary/60 px-4 py-10 dark:bg-background">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <Link to="/login" aria-label="Wishers" className="mx-auto mb-6 block w-fit">
                    <img src={logo} alt="Wishers" className="size-16 rounded-2xl shadow-lg shadow-brand/20" />
                </Link>
                <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">{children}</div>
            </div>
        </div>
    );
}
