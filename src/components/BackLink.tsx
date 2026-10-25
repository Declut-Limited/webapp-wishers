import { Link } from "react-router-dom";
import { PiArrowLeftBold } from "react-icons/pi";

export function BackLink({ to, label }: { to: string; label: string }) {
    return (
        <Link to={to} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <PiArrowLeftBold aria-hidden /> {label}
        </Link>
    );
}
