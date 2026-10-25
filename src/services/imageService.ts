import { api } from "@/lib/api";

type UploadSignature = { signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string };

export type ImageValue = string | File;

// Signed upload: the API signs, the images go straight to Cloudinary. URLs already uploaded pass through.
export async function uploadImages(images: ImageValue[], folder: "users" | "wishlists" | "wishitems"): Promise<string[]> {
    const files = images.filter((img): img is File => img instanceof File);
    if (!files.length) return images as string[];

    const signatures = await api<UploadSignature[]>(`/media/upload-signature?folder=${folder}&count=${files.length}`);

    const uploaded = await Promise.all(
        files.map(async (file, i) => {
            const sig = signatures[i] ?? signatures[0];
            const form = new FormData();
            form.append("file", file);
            form.append("api_key", sig.apiKey);
            form.append("timestamp", String(sig.timestamp));
            form.append("signature", sig.signature);
            form.append("folder", sig.folder);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error("Error uploading image");
            return ((await res.json()) as { secure_url: string }).secure_url;
        }),
    );

    let next = 0;
    return images.map((img) => (img instanceof File ? uploaded[next++] : img));
}

export const imageSrc = (img: ImageValue) => (img instanceof File ? URL.createObjectURL(img) : img);
