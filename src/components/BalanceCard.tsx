// The mobile app's green balance card: one headline figure with a row of figures under it.
export function BalanceCard({ label, value, stats, loading }: { label: string; value: string; stats: { label: string; value: string }[]; loading: boolean }) {
    return (
        <section
            aria-label={label}
            className="relative flex min-h-52 flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-[#3c9150] via-brand-light to-brand-dark p-6 text-white shadow-lg shadow-brand-dark/25 md:p-8"
        >
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-14 size-52 rounded-full border-16 border-white/7" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-linear-to-b from-white/25 to-transparent dark:hidden" />

            <div className="relative">
                <p className="text-xs font-bold tracking-[0.12em] text-white/75 uppercase">{label}</p>
                <p className="mt-1 truncate text-4xl font-extrabold md:text-5xl">{loading ? "––" : value}</p>
            </div>

            <dl className="relative mt-6 flex divide-x divide-white/25 border-t border-white/25 pt-4">
                {stats.map((s) => (
                    <div key={s.label} className="min-w-0 flex-1 px-4 first:pl-0 last:pr-0">
                        <dt className="truncate text-sm font-semibold text-white/75">{s.label}</dt>
                        <dd className="truncate text-lg font-bold">{loading ? "––" : s.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
