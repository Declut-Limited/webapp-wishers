import { useEffect, useState } from "react";

// Seconds left before a code can be resent; start() restarts the count.
export function useCooldown(seconds: number, startOn = false) {
    const [left, setLeft] = useState(startOn ? seconds : 0);

    useEffect(() => {
        if (left <= 0) return;
        const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [left]);

    return { left, start: () => setLeft(seconds) };
}
