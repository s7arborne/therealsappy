"use client";
import { useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
];

const HANDLE = 14;

/**
 * Lightweight, dependency-free image cropper. Shows the picked image, lets the
 * user move/resize a crop box (optionally aspect-locked), then renders the
 * selection to a canvas at the image's native resolution and returns a Blob.
 */
export function ImageCropper({ file, onCancel, onCropped }: {
  file: File; onCancel: () => void; onCropped: (blob: Blob) => void;
}) {
  const [src, setSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [display, setDisplay] = useState({ w: 0, h: 0 });
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspect, setAspect] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // Create + revoke the object URL together so each effect run (incl. StrictMode's
  // double-invoke in dev) gets a live URL and revokes its own.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing object URL lifecycle
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const fit = (r: Rect, d = display): Rect => {
    let { x, y, w, h } = r;
    w = Math.max(24, Math.min(w, d.w));
    h = Math.max(24, Math.min(h, d.h));
    x = Math.max(0, Math.min(x, d.w - w));
    y = Math.max(0, Math.min(y, d.h - h));
    return { x, y, w, h };
  };

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    const scale = Math.min(460 / img.naturalWidth, 420 / img.naturalHeight, 1);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const d = { w, h };
    setDisplay(d);
    const cw = Math.round(w * 0.8), ch = Math.round(h * 0.8);
    setRect(fit({ x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch }, d));
  };

  const startDrag = (kind: "move" | "resize") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const px = e.clientX, py = e.clientY, start = rect, ar = aspect, d = display;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - px, dy = ev.clientY - py;
      if (kind === "move") {
        setRect(fit({ ...start, x: start.x + dx, y: start.y + dy }, d));
      } else {
        let w = Math.min(start.w + dx, d.w - start.x);
        let h = Math.min(ar ? w / ar : start.h + dy, d.h - start.y);
        if (ar) { if (w / ar > h) w = h * ar; else h = w / ar; }
        setRect(fit({ x: start.x, y: start.y, w, h }, d));
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const pickAspect = (value: number | null) => {
    setAspect(value);
    if (value == null) return;
    // refit current box to the chosen ratio, anchored at its top-left
    let w = rect.w, h = w / value;
    if (h > display.h - rect.y) { h = display.h - rect.y; w = h * value; }
    if (w > display.w - rect.x) { w = display.w - rect.x; h = w / value; }
    setRect(fit({ x: rect.x, y: rect.y, w, h }));
  };

  const confirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const sX = img.naturalWidth / display.w, sY = img.naturalHeight / display.h;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(rect.w * sX);
    canvas.height = Math.round(rect.h * sY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, rect.x * sX, rect.y * sY, rect.w * sX, rect.h * sY, 0, 0, canvas.width, canvas.height);
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    setBusy(true);
    canvas.toBlob(b => { if (b) onCropped(b); else setBusy(false); }, type, 0.92);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="admin-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.78)", backdropFilter: "blur(4px)" }} onClick={onCancel} />
      <div className="glass admin-modal" style={{ position: "relative", zIndex: 1, padding: 24, borderRadius: 20, background: "var(--panel)", maxWidth: "95vw" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Crop image</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Drag the box to move, drag the corner to resize.</p>

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {ASPECTS.map(a => (
            <button key={a.label} type="button" onClick={() => pickAspect(a.value)}
              className="admin-icon-btn"
              style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: "1px solid var(--glass-bd)",
                background: aspect === a.value ? "var(--accent)" : "var(--glass)",
                color: aspect === a.value ? "#fff" : "var(--fg)" }}>
              {a.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: display.w || 460, height: display.h || 300, margin: "0 auto",
          touchAction: "none", userSelect: "none", background: "var(--glass)", borderRadius: 8, overflow: "hidden" }}>
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={imgRef} src={src} alt="to crop" onLoad={onImgLoad} draggable={false}
              style={{ width: display.w || "auto", height: display.h || "auto", display: "block", pointerEvents: "none" }} />
          )}
          {display.w > 0 && (
            <>
              {/* dim mask */}
              <div style={{ position: "absolute", inset: 0, boxShadow: `0 0 0 9999px rgba(0,0,0,.5)`, pointerEvents: "none",
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${rect.x}px ${rect.y}px, ${rect.x}px ${rect.y + rect.h}px, ${rect.x + rect.w}px ${rect.y + rect.h}px, ${rect.x + rect.w}px ${rect.y}px, ${rect.x}px ${rect.y}px)` }} />
              {/* crop box */}
              <div onPointerDown={startDrag("move")}
                style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h,
                  border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,.4)", cursor: "move", boxSizing: "border-box" }}>
                <div onPointerDown={startDrag("resize")}
                  style={{ position: "absolute", right: -HANDLE / 2, bottom: -HANDLE / 2, width: HANDLE, height: HANDLE,
                    background: "var(--accent)", borderRadius: 3, cursor: "nwse-resize", border: "2px solid #fff" }} />
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onCancel} disabled={busy}
            style={{ padding: "9px 18px", borderRadius: 10, background: "var(--glass)", border: "1px solid var(--glass-bd)", color: "var(--fg)", fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button type="button" onClick={confirm} disabled={busy || display.w === 0} className="admin-btn-primary" style={{ padding: "10px 20px" }}>
            {busy ? "Cropping…" : "Crop & upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
