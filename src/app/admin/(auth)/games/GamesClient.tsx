"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Select, ToggleField, SubmitButton } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createGame, updateGame, deleteGame, toggleGameVisible, reorderGames } from "@/lib/actions/games";
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
    { key: "coverUrl", header: "", render: (r: Game) => r.coverUrl
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={r.coverUrl} alt="" className="admin-thumb" /> : null },
    { key: "title", header: "Title", render: (r: Game) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
    { key: "platform", header: "Platform" },
    { key: "status", header: "Status", render: (r: Game) => <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 999, background: "var(--glass)", border: "1px solid var(--glass-bd)" }}>{r.status}</span> },
  ];

  const c = editing ?? { id: "", title: "", platform: "", genre: "", status: "Now Playing", coverUrl: "", rating: "", visible: true, order: games.length };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Games</h1>
        <button onClick={() => setCreating(true)} className="admin-btn-primary">+ Add Game</button>
      </div>
      <AdminTable data={games} columns={cols} onEdit={setEditing} searchKeys={["title", "platform", "genre", "status"]}
        onDelete={async id => { await deleteGame(id); router.refresh(); }}
        onToggleVisible={async (id, v) => { await toggleGameVisible(id, v); router.refresh(); }}
        onReorder={async ids => { await reorderGames(ids); router.refresh(); }} />
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
          <FieldWrap label="Cover Image"><ImageUpload name="coverUrl" defaultValue={c.coverUrl} /></FieldWrap>
          <FieldWrap label="Rating"><Input name="rating" defaultValue={c.rating} placeholder="★★★★" /></FieldWrap>
          <input name="order" type="hidden" defaultValue={c.order} />
          <ToggleField name="visible" label="Visible" defaultChecked={c.visible} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
