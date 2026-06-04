"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Select, CheckboxField, SubmitButton } from "@/components/admin/FormField";
import { createGame, updateGame, deleteGame, toggleGameVisible } from "@/lib/actions/games";
import { toast } from "sonner";
import type { Game } from "@prisma/client";
import { useRouter } from "next/navigation";

const STATUSES = ["Now Playing", "Completed", "100%'d", "On Deck", "Backlog"];

export function GamesClient({ games }: { games: Game[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Game | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      platform: fd.get("platform") as string || "",
      genre: fd.get("genre") as string || "",
      status: fd.get("status") as string || "Now Playing",
      coverUrl: fd.get("coverUrl") as string || "",
      rating: fd.get("rating") as string || "",
      visible: fd.get("visible") === "on",
      order: Number(fd.get("order") || 0),
    };
    startTransition(async () => {
      try {
        if (editing) await updateGame(editing.id, data);
        else await createGame(data);
        toast.success("Saved"); setEditing(null); setCreating(false); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const cols = [
    { key: "title", header: "Title" },
    { key: "platform", header: "Platform" },
    { key: "status", header: "Status" },
    { key: "order", header: "Order" },
  ];

  const c = editing ?? { id: "", title: "", platform: "", genre: "", status: "Now Playing", coverUrl: "", rating: "", visible: true, order: games.length };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Games</h1>
        <button onClick={() => setCreating(true)} style={{ padding: "8px 18px", borderRadius: 10, background: "var(--fg)", color: "var(--bg)", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Game</button>
      </div>
      <AdminTable data={games} columns={cols} onEdit={setEditing}
        onDelete={async id => { await deleteGame(id); router.refresh(); }}
        onToggleVisible={async (id, v) => { await toggleGameVisible(id, v); router.refresh(); }} />
      <AdminDialog title={editing ? "Edit Game" : "New Game"} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }}>
        <form onSubmit={handleSubmit}>
          <FieldWrap label="Title"><Input name="title" defaultValue={c.title} required /></FieldWrap>
          <FieldWrap label="Platform"><Input name="platform" defaultValue={c.platform} placeholder="PC, PlayStation, etc." /></FieldWrap>
          <FieldWrap label="Genre"><Input name="genre" defaultValue={c.genre} /></FieldWrap>
          <FieldWrap label="Status">
            <Select name="status" defaultValue={c.status}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Cover URL"><Input name="coverUrl" defaultValue={c.coverUrl} placeholder="https://..." /></FieldWrap>
          <FieldWrap label="Rating"><Input name="rating" defaultValue={c.rating} placeholder="★★★★" /></FieldWrap>
          <FieldWrap label="Order"><Input name="order" type="number" defaultValue={c.order} /></FieldWrap>
          <CheckboxField label="Visible" checked={c.visible} onChange={() => {}} />
          <input name="visible" type="checkbox" defaultChecked={c.visible} style={{ display: "none" }} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
