import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppSettings } from "@/lib/types";

// App limits set by the admin (image count, goal range, creation limits).
export function useSettings() {
    return useQuery({
        queryKey: ["/settings"],
        queryFn: () => api<AppSettings>("/settings", { auth: false }),
        staleTime: 10 * 60_000,
    }).data;
}
