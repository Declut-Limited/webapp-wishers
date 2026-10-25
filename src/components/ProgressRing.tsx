// Circular progress, same ring as the mobile wishlist cards.
export function ProgressRing({ percent, size = 56, stroke = 5 }: { percent: number; size?: number; stroke?: number }) {
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const clamped = Math.min(Math.max(percent, 0), 100);

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${clamped}% raised`}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-neutral-200 dark:stroke-neutral-800" />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - clamped / 100)}
                    className="stroke-brand-light transition-[stroke-dashoffset] duration-700 dark:stroke-brand-lime-dark"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold" style={{ fontSize: Math.max(10, Math.round(size * 0.22)) }}>{Math.round(clamped)}%</span>
        </div>
    );
}
