import { api } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import type { WishItem, Wishlist } from "@/lib/types";
import { uploadImages, type ImageValue } from "./imageService";

// Refetch every cached GET whose path starts with one of these (keys are [path]).
export function invalidatePaths(...prefixes: string[]) {
    return queryClient.invalidateQueries({
        predicate: (q) => typeof q.queryKey[0] === "string" && prefixes.some((p) => (q.queryKey[0] as string).startsWith(p)),
    });
}

const refreshWishlists = () => invalidatePaths("/wishlists", "/wish-items", "/contributors");

// Slug, link and totals are set by the API.
export async function saveWishlist(data: { _id?: string; title: string; description: string; image?: ImageValue }) {
    const [image] = data.image ? await uploadImages([data.image], "wishlists") : [];
    const body = { title: data.title, description: data.description || undefined, image };
    const saved = data._id
        ? await api<Wishlist>(`/wishlists/${data._id}`, { method: "PATCH", body })
        : await api<Wishlist>("/wishlists", { method: "POST", body });
    await refreshWishlists();
    return saved;
}

// The API also removes the wishlist's wishes and visits.
export async function deleteWishlist(id: string) {
    await api(`/wishlists/${id}`, { method: "DELETE" });
    queryClient.removeQueries({ queryKey: [`/wishlists/${id}`] });
    await refreshWishlists();
}

// The API recalculates the wishlist totals after every wish change.
export async function saveWish(data: { _id?: string; wishlistId: string; title: string; description: string; goalAmount: number; images: ImageValue[] }) {
    const images = await uploadImages(data.images, "wishitems");
    const body = { title: data.title, description: data.description || undefined, images, goalAmount: data.goalAmount };
    const saved = data._id
        ? await api<WishItem>(`/wish-items/${data._id}`, { method: "PATCH", body })
        : await api<WishItem>(`/wishlists/${data.wishlistId}/items`, { method: "POST", body });
    await refreshWishlists();
    return saved;
}

export async function deleteWish(id: string) {
    await api(`/wish-items/${id}`, { method: "DELETE" });
    queryClient.removeQueries({ queryKey: [`/wish-items/${id}`] });
    await refreshWishlists();
}
