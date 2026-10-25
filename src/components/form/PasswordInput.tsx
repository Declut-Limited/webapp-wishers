import { useState, type ComponentProps } from "react";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, "type">) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input type={visible ? "text" : "password"} className={cn("h-11 pr-11", className)} {...props} />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
                {visible ? <PiEyeSlashBold className="size-5" /> : <PiEyeBold className="size-5" />}
            </button>
        </div>
    );
}
