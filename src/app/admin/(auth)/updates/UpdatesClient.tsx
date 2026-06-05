"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Textarea, ToggleField, SubmitButton } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createUpdate, updateUpdate, deleteUpdate, toggleUpdateVisible, reorderUpdates } from "@/lib/actions/updates";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Update } from "@prisma/client";
import { useRouter } from "next/navigation";

export function UpdatesClient({ updates }: { updates: Update[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Update | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      iconUrl: fd.get("iconUrl") as string || "",
      imageUrl: fd.get("imageUrl") as string || "",
      link: fd.get("link") as string || "",
      date: fd.get("date") as string,
      visible: fd.get("visible") === "on",
      order: Number(fd.get("order") || 0),
    };
    startTransition(async () => {
      try {
        if (editing) await updateUpdate(editing.id, data);
        else await createUpdate(data);
        toast.success("Saved");
        setEditing(null); setCreating(false);
        router.refresh();
      } catch { toast.error("Failed to save"); }
    });
  };

  const cols = [
    { key: "iconUrl", header: "", render: (r: Update) => <span style={{ fontSize: 18 }}>{r.iconUrl || "◆"}</span> },
    { key: "title", header: "Title", render: (r: Update) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
    { key: "date", header: "Date", render: (r: Update) => format(new Date(r.date), "MMM yyyy") },
  ];

  const current = editing ?? { id: "", title: "", description: "", iconUrl: "", imageUrl: "", link: "", date: new Date().toISOString().slice(0,10), visible: true, order: updates.length, createdAt: new Date() };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Updates</h1>
        <button onClick={() => setCreating(true)} className="admin-btn-primary">+ Add Update</button>
      </div>
      <AdminTable
        data={updates} columns={cols}
        onEdit={setEditing} searchKeys={["title", "description"]}
        onDelete={async id => { await deleteUpdate(id); router.refresh(); }}
        onToggleVisible={async (id, v) => { await toggleUpdateVisible(id, v); router.refresh(); }}
        onReorder={async ids => { await reorderUpdates(ids); router.refresh(); }}
      />
      <AdminDialog title={editing ? "Edit Update" : "New Update"} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }}>
        <form onSubmit={handleSubmit}>
          <FieldWrap label="Title"><Input name="title" defaultValue={current.title} required /></FieldWrap>
          <FieldWrap label="Description"><Textarea name="description" defaultValue={current.description} required /></FieldWrap>
          <FieldWrap label="Icon (emoji/symbol)"><Input name="iconUrl" defaultValue={current.iconUrl} placeholder="◆" /></FieldWrap>
          <FieldWrap label="Image"><ImageUpload name="imageUrl" defaultValue={current.imageUrl} /></FieldWrap>
          <FieldWrap label="Link URL"><Input name="link" defaultValue={current.link} /></FieldWrap>
          <FieldWrap label="Date"><Input name="date" type="date" defaultValue={new Date(current.date).toISOString().slice(0,10)} required /></FieldWrap>
          <input name="order" type="hidden" defaultValue={current.order} />
          <ToggleField name="visible" label="Visible" defaultChecked={current.visible} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
