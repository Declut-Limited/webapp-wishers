import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

// The Wishers logo from app-wishers (assets/images/favicon-big.png).
export function Brand({ compact = false, className, logoClassName }: { compact?: boolean; className?: string; logoClassName?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <img src={logo} alt={compact ? "Wishers" : ""} className={cn("size-8 shrink-0", logoClassName)} />
            {!compact && <span className="text-lg font-extrabold tracking-tight">Wishers</span>}
        </div>
    );
}
