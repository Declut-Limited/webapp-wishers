import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";

// Auth screens (login, sign-up, verify, password reset) in Learnify's style: the logo on top,
// then the form in a single centred column, no card around it. Light and dark like the app.
export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background px-6 py-6 sm:px-12 sm:py-8">
            <div className="relative flex items-center justify-center">
                <a href="https://wishers.com.ng" aria-label="Wishers website">
                    <Brand logoClassName="size-9" />
                </a>
                <div className="absolute right-0">
                    <ThemeToggle />
                </div>
            </div>

            <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</main>
        </div>
    );
}
