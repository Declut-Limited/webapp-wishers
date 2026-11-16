import type { ReactNode } from "react";

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div className="mb-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {children && <p className="mt-2 text-muted-foreground">{children}</p>}
        </div>
    );
}
