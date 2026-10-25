import { useEffect } from "react";
import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { subscribeRealtime, type RealtimeEvent } from "@/lib/realtime";

// GET an API path with TanStack Query, refetching quietly whenever the server pings one of liveEvents.
// Pass a null path to wait (e.g. until an id is known).
export function useLiveQuery<T>(path: string | null, liveEvents: RealtimeEvent[] = [], key?: QueryKey) {
    const queryClient = useQueryClient();
    const queryKey = key ?? [path];

    const liveKey = liveEvents.join(",");
    useEffect(() => {
        if (!path || !liveEvents.length) return;
        return subscribeRealtime(liveEvents, () => queryClient.invalidateQueries({ queryKey }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, liveKey]);

    return useQuery({
        queryKey,
        queryFn: () => api<T>(path!),
        enabled: !!path,
    });
}
