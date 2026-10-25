import { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { subscribeRealtime, type RealtimeEvent } from "@/lib/realtime";
import type { Page } from "@/lib/types";

// Page-based list ({ results, hasMore }) with "load more", refetched when the server pings liveEvents.
export function usePaginated<T>(path: string, perPage = 20, liveEvents: RealtimeEvent[] = []) {
    const queryClient = useQueryClient();
    const queryKey = [path, "pages", perPage];

    const liveKey = liveEvents.join(",");
    useEffect(() => {
        if (!liveEvents.length) return;
        return subscribeRealtime(liveEvents, () => queryClient.invalidateQueries({ queryKey }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, liveKey]);

    const query = useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => {
            const sep = path.includes("?") ? "&" : "?";
            return api<Page<T>>(`${path}${sep}page=${pageParam}&limit=${perPage}`);
        },
        getNextPageParam: (last, pages) => (last.hasMore ? pages.length + 1 : undefined),
    });

    return { ...query, items: query.data?.pages.flatMap((p) => p.results) ?? [] };
}
