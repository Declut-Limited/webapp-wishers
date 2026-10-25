import type { ReactNode } from "react";

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {children && <p className="mt-1.5 text-muted-foreground">{children}</p>}
        </div>
    );
}
