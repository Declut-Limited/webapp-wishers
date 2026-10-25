import { useEffect, useMemo, useRef } from "react";
import { PiImageBold, PiXBold } from "react-icons/pi";
import { toast } from "sonner";
import type { ImageValue } from "@/services/imageService";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;

// Pick up to `max` images (new Files or already-uploaded URLs); the first is the cover.
export function ImagesInput({ id, value, onChange, max = 1, className }: { id: string; value: ImageValue[]; onChange: (v: ImageValue[]) => void; max?: number; className?: string }) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Object URLs for new files, revoked when they change.
    const previews = useMemo(() => value.map((img) => (img instanceof File ? URL.createObjectURL(img) : img)), [value]);
    useEffect(() => () => previews.forEach((src, i) => value[i] instanceof File && URL.revokeObjectURL(src)), [previews, value]);

    const handleFiles = (files: FileList | null) => {
        if (!files?.length) return;
        const picked = Array.from(files).filter((f) => {
            if (!f.type.startsWith("image/")) return toast.error(`${f.name} isn't an image`), false;
            if (f.size > MAX_BYTES) return toast.error(`${f.name} is larger than 5MB`), false;
            return true;
        });
        const next = max === 1 ? picked.slice(0, 1) : [...value, ...picked];
        if (next.length > max) toast.error(`You can add up to ${max} images`);
        onChange(next.slice(0, max));
        if (inputRef.current) inputRef.current.value = "";
    };

    const single = max === 1;

    return (
        <div className={cn("flex flex-wrap gap-3", className)}>
            {previews.map((src, i) => (
                <div key={src} className={cn("group relative overflow-hidden rounded-xl border bg-muted", single ? "aspect-video w-full" : "size-24")}>
                    <img src={src} alt={i === 0 ? "Cover image" : `Image ${i + 1}`} className="size-full object-cover" />
                    {i === 0 && !single && <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>}
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((_, j) => j !== i))}
                        aria-label="Remove image"
                        className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                        <PiXBold className="size-3.5" />
                    </button>
                </div>
            ))}

            {value.length < max && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        single ? "aspect-video w-full" : "size-24",
                    )}
                >
                    <PiImageBold className="size-6" aria-hidden />
                    {single ? "Add a cover photo" : "Add image"}
                </button>
            )}

            <input ref={inputRef} id={id} type="file" accept="image/*" multiple={!single} hidden onChange={(e) => handleFiles(e.target.files)} />
        </div>
    );
}
