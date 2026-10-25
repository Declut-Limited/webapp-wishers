import { Brand } from "@/components/Brand";

export function Splash() {
    return (
        <div className="flex min-h-svh items-center justify-center" role="status" aria-label="Loading">
            <Brand className="animate-pulse" />
        </div>
    );
}
