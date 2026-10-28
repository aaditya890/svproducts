"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setProductImage } from "@/app/admin/actions";

export const inputCls =
  "w-full rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none focus:border-furnace focus:ring-2 focus:ring-forge/40";
export const btnCls =
  "inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-furnace disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-md border border-steel/30 px-3 py-2 text-sm font-medium text-navy transition hover:bg-mist";

export function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-steel">
      {text}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
    </label>
  );
}

/** Delete button that asks "are you sure?" before submitting its form. */
export function ConfirmDelete({ action, id, label = "Delete", message }: { action: (fd: FormData) => Promise<void>; id: string; label?: string; message: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
        <Trash2 size={15} /> {label}
      </button>
    </form>
  );
}

/** Uploads straight from the browser to Supabase Storage (admin session), then saves the URL. */
export function ImageUploader({ productId, current }: { productId: string; current: string | null }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(current);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setError("Please choose a PNG, JPG or WebP image.");
    if (file.size > 6 * 1024 * 1024) return setError("Image is larger than 6 MB.");
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${productId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("products").upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      startTransition(async () => {
        await setProductImage(productId, data.publicUrl);
        setPreview(data.publicUrl);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex h-56 items-center justify-center overflow-hidden rounded-xl border border-dashed border-steel/40 bg-mist">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Product" className="h-full w-full object-contain p-2" />
        ) : (
          <span className="text-sm text-steel">No image yet</span>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={btnCls} disabled={uploading || busy} onClick={() => fileRef.current?.click()}>
          {uploading || busy ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />} {preview ? "Replace image" : "Upload image"}
        </button>
        {preview && (
          <button type="button" className={btnGhost} disabled={uploading || busy} onClick={() => startTransition(async () => { await setProductImage(productId, ""); setPreview(null); })}>
            Remove
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-steel">PNG with transparent background works best. Max 6 MB.</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
