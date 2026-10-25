import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, message, action, className }: { icon: IconType; title: string; message?: string; action?: ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className)}>
            <span className="mb-1 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-7" aria-hidden />
            </span>
            <h3 className="text-lg font-bold">{title}</h3>
            {message && <p className="max-w-sm text-sm text-muted-foreground">{message}</p>}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
