import { useMemo, useState } from "react";
import { PiCaretUpDownBold, PiCheckBold, PiMagnifyingGlassBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Bank } from "@/lib/types";
import { cn } from "@/lib/utils";

// Searchable bank picker (Nigeria has hundreds of banks and fintechs).
export function BankSelect({ id, banks, value, onChange, disabled }: { id: string; banks: Bank[]; value: string; onChange: (code: string) => void; disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const selected = banks.find((b) => b.code === value);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? banks.filter((b) => b.name.toLowerCase().includes(q)) : banks;
    }, [banks, query]);

    return (
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
            <PopoverTrigger asChild>
                <Button id={id} type="button" variant="outline" role="combobox" aria-expanded={open} disabled={disabled} className="h-11 w-full justify-between font-normal">
                    <span className={cn("truncate", !selected && "text-muted-foreground")}>{selected?.name ?? "Select your bank"}</span>
                    <PiCaretUpDownBold className="opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <div className="relative border-b p-2">
                    <PiMagnifyingGlassBold className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    <Input autoFocus placeholder="Search banks" value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 pl-8" aria-label="Search banks" />
                </div>
                <ul role="listbox" className="max-h-72 overflow-y-auto p-1">
                    {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No bank found</li>}
                    {filtered.map((b) => (
                        <li key={`${b.code}-${b.slug}`}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={b.code === value}
                                onClick={() => { onChange(b.code); setOpen(false); setQuery(""); }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                            >
                                <span className="flex-1 truncate">{b.name}</span>
                                {b.code === value && <PiCheckBold className="text-primary" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
}
