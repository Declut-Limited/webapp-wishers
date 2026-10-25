// While a page's code loads.
export function PageLoader() {
    return (
        <div className="flex min-h-[50svh] items-center justify-center" role="status" aria-label="Loading">
            <span className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
    );
}
