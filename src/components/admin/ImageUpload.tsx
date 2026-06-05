"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageCropper } from "./ImageCropper";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
}

// File types that don't make sense to rasterize through the canvas cropper.
const SKIP_CROP = ["image/svg+xml", "image/gif"];

// Uploads an image to Vercel Blob via /api/admin/upload and keeps the
// resulting public URL in a hidden input so it submits with the form.
export function ImageUpload({ name, defaultValue = "" }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Decide whether the picked file goes straight to upload or through the cropper.
  const pickFile = (file: File) => {
    if (SKIP_CROP.includes(file.type)) upload(file);
    else setCropFile(file);
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(error || "Upload failed");
      }
      const { url: uploaded } = await res.json();
      setUrl(uploaded);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleCropped = (blob: Blob) => {
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const base = (cropFile?.name ?? "image").replace(/\.\w+$/, "");
    const file = new File([blob], `${base}.${ext}`, { type: blob.type });
    setCropFile(null);
    upload(file);
  };

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
        onChange={e => { const f = e.target.files?.[0]; if (inputRef.current) inputRef.current.value = ""; if (f) pickFile(f); }}
        style={{ display: "none" }}
      />
      {cropFile && (
        <ImageCropper file={cropFile} onCancel={() => setCropFile(null)} onCropped={handleCropped} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="preview" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", border: "1px solid var(--glass-bd)", background: "var(--glass)" }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 10, border: "1px dashed var(--glass-bd)", background: "var(--glass)", display: "grid", placeItems: "center", color: "var(--faint)", fontSize: 22 }}>🖼</div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            style={{ padding: "8px 16px", borderRadius: 9, background: "var(--glass)", border: "1px solid var(--glass-bd)", color: "var(--fg)", fontSize: 13, cursor: uploading ? "wait" : "pointer" }}>
            {uploading ? "Uploading…" : url ? "Replace" : "Upload image"}
          </button>
          {url && !uploading && (
            <button type="button" onClick={() => setUrl("")}
              style={{ padding: "8px 16px", borderRadius: 9, background: "none", border: "1px solid var(--glass-bd)", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
