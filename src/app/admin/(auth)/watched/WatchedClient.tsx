"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Textarea, CheckboxField, SubmitButton } from "@/components/admin/FormField";
import { createWatched, updateWatched, deleteWatched, toggleWatchedVisible } from "@/lib/actions/watched";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Watched } from "@prisma/client";
import { useRouter } from "next/navigation";

export function WatchedClient({ watched }: { watched: Watched[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Watched | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      filmTitle: fd.get("filmTitle") as string,
      year: fd.get("year") as string || "",
      rating: fd.get("rating") as string || "",
      note: fd.get("note") as string || "",
      link: fd.get("link") as string || "",
      watchedAt: fd.get("watchedAt") as string,
      visible: fd.get("visible") === "on",
    };
    startTransition(async () => {
      try {
        if (editing) await updateWatched(editing.id, data);
        else await createWatched(data);
        toast.success("Saved"); setEditing(null); setCreating(false); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const cols = [
    { key: "filmTitle", header: "Title" },
    { key: "year", header: "Year" },
    { key: "rating", header: "Rating" },
    { key: "watchedAt", header: "Watched", render: (r: Watched) => format(new Date(r.watchedAt), "MMM d, yyyy") },
  ];

  const today = new Date().toISOString().slice(0, 10);
  const c = editing ?? { id: "", filmTitle: "", year: "", rating: "", note: "", link: "", watchedAt: new Date(), visible: true, source: "manual" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Watched</h1>
        <button onClick={() => setCreating(true)} style={{ padding: "8px 18px", borderRadius: 10, background: "var(--fg)", color: "var(--bg)", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Film</button>
      </div>
      <AdminTable data={watched} columns={cols} onEdit={setEditing}
        onDelete={async id => { await deleteWatched(id); router.refresh(); }}
        onToggleVisible={async (id, v) => { await toggleWatchedVisible(id, v); router.refresh(); }} />
      <AdminDialog title={editing ? "Edit Film" : "New Film"} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }}>
        <form onSubmit={handleSubmit}>
          <FieldWrap label="Title"><Input name="filmTitle" defaultValue={c.filmTitle} required /></FieldWrap>
          <FieldWrap label="Year"><Input name="year" defaultValue={c.year} placeholder="2024" /></FieldWrap>
          <FieldWrap label="Rating"><Input name="rating" defaultValue={c.rating} placeholder="★★★★½" /></FieldWrap>
          <FieldWrap label="Note"><Textarea name="note" defaultValue={c.note} style={{ minHeight: 80 }} /></FieldWrap>
          <FieldWrap label="Link URL"><Input name="link" defaultValue={c.link} /></FieldWrap>
          <FieldWrap label="Watched Date"><Input name="watchedAt" type="date" defaultValue={new Date(c.watchedAt).toISOString().slice(0,10)} required /></FieldWrap>
          <CheckboxField label="Visible" checked={c.visible} onChange={() => {}} />
          <input name="visible" type="checkbox" defaultChecked={c.visible} style={{ display: "none" }} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
