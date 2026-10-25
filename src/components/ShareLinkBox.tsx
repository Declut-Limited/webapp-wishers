import { PiArrowSquareOutBold, PiCopyBold, PiShareFatBold } from "react-icons/pi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { shareLink } from "@/utils/helper";

// The public link givers open (pay-wishers), with copy, share and open.
export function ShareLinkBox({ title, link }: { title: string; link: string }) {
    const copy = async () => {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied");
    };

    return (
        <div className="rounded-2xl bg-secondary p-3">
            <p className="mb-2 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Share link</p>
            <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate rounded-lg bg-background px-3 py-2 font-mono text-sm" title={link}>{link}</p>
                <Button variant="outline" size="icon" onClick={copy} aria-label="Copy link"><PiCopyBold /></Button>
                <Button variant="outline" size="icon" asChild>
                    <a href={link} target="_blank" rel="noreferrer" aria-label="Open link in a new tab"><PiArrowSquareOutBold /></a>
                </Button>
                <Button size="icon" onClick={() => shareLink(title, link, () => toast.success("Link copied"))} aria-label="Share"><PiShareFatBold /></Button>
            </div>
        </div>
    );
}
