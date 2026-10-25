import { useTheme } from "next-themes";
import { PiMoonBold, PiSunBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const dark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(dark ? "light" : "dark")}
        >
            {dark ? <PiSunBold className="size-5" /> : <PiMoonBold className="size-5" />}
        </Button>
    );
}
