import type { FormEvent, ReactNode } from "react";
import { PiXBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    busy?: boolean;
    onSubmit: (e: FormEvent) => void;
    footer: ReactNode;
    children: ReactNode;
};

// A form that takes the whole screen: a top bar with close, a scrolling body and actions pinned to the bottom.
export function FullScreenForm({ open, onOpenChange, title, description, busy, onSubmit, footer, children }: Props) {
    return (
        <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
            <DialogContent
                showCloseButton={false}
                className="inset-0 top-0 left-0 flex h-svh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-background p-0 ring-0 sm:max-w-none data-open:zoom-in-100 data-closed:zoom-out-100"
            >
                <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                    <header className="flex items-center gap-3 border-b px-4 py-3 md:px-6">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" size="icon" aria-label="Close" disabled={busy}><PiXBold className="size-5" /></Button>
                        </DialogClose>
                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-extrabold">{title}</DialogTitle>
                            {description && <DialogDescription className="truncate">{description}</DialogDescription>}
                        </div>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6 md:px-6">{children}</div>
                    </div>

                    <footer className="border-t pb-[env(safe-area-inset-bottom)]">
                        <div className="mx-auto flex w-full max-w-xl justify-end gap-2 px-4 py-3 md:px-6">{footer}</div>
                    </footer>
                </form>
            </DialogContent>
        </Dialog>
    );
}
