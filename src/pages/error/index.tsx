import { Link } from "react-router-dom";

export default function Error() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="text-muted-foreground">That page doesn't exist.</p>
            <Link to="/" className="mt-2 font-semibold text-primary hover:underline">Go home</Link>
        </div>
    );
}
