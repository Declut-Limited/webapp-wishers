import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/defaultAvatar.png";
import { cn } from "@/lib/utils";

export function UserAvatar({ name, image, className }: { name?: string; image?: string; className?: string }) {
    const initials = name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

    return (
        <Avatar className={cn("size-9", className)}>
            <AvatarImage src={image || defaultAvatar} alt={name ? `${name}'s photo` : "Profile photo"} className="object-cover" />
            <AvatarFallback className="bg-brand-mint font-semibold text-brand-dark">{initials || "W"}</AvatarFallback>
        </Avatar>
    );
}
