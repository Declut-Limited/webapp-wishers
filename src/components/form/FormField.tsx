import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function FormField({ id, label, hint, action, children }: { id: string; label: string; hint?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={id}>{label}</Label>
                {action}
            </div>
            {children}
            {hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
