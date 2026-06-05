"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Textarea, ToggleField, SubmitButton } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createThought, updateThought, deleteThought } from "@/lib/actions/thoughts";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Thought } from "@prisma/client";
import { useRouter } from "next/navigation";

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 80);
}

export function ThoughtsClient({ thoughts }: { thoughts: Thought[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Thought | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();
  const [slugVal, setSlugVal] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      slug: fd.get("slug") as string,
      title: fd.get("title") as string,
      topic: fd.get("topic") as string || "",
      imageUrl: fd.get("imageUrl") as string || "",
      bodyMd: fd.get("bodyMd") as string,
      isNew: fd.get("isNew") === "on",
      published: fd.get("published") === "on",
      publishedAt: fd.get("publishedAt") as string || undefined,
    };
    startTransition(async () => {
      try {
        if (editing) await updateThought(editing.id, data);
        else await createThought(data);
        toast.success("Saved"); setEditing(null); setCreating(false); setSlugVal(""); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const cols = [
    { key: "title", header: "Title" },
    { key: "topic", header: "Topic" },
    { key: "published", header: "Published", render: (r: Thought) => r.published ? <span style={{ color: "var(--accent)" }}>Live</span> : <span style={{ color: "var(--muted)" }}>Draft</span> },
    { key: "publishedAt", header: "Date", render: (r: Thought) => r.publishedAt ? format(new Date(r.publishedAt), "MMM d, yyyy") : "—" },
  ];

  const today = new Date().toISOString().slice(0, 10);
  const c = editing ?? { id: "", slug: "", title: "", topic: "", imageUrl: "", bodyMd: "", isNew: false, published: false, publishedAt: null, createdAt: new Date(), updatedAt: new Date() };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Thoughts</h1>
        <button onClick={() => { setCreating(true); setSlugVal(""); }} className="admin-btn-primary">+ New Thought</button>
      </div>
      <AdminTable data={thoughts} columns={cols} onEdit={r => { setEditing(r); setSlugVal(r.slug); }} searchKeys={["title", "topic"]}
        onDelete={async id => { await deleteThought(id); router.refresh(); }} />
      <AdminDialog title={editing ? "Edit Thought" : "New Thought"} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); setSlugVal(""); }}>
        <form onSubmit={handleSubmit}>
          <FieldWrap label="Title">
            <Input name="title" defaultValue={c.title} required onChange={e => !editing && setSlugVal(toSlug(e.target.value))} />
          </FieldWrap>
          <FieldWrap label="Slug">
            <Input name="slug" value={editing ? slugVal || c.slug : slugVal} onChange={e => setSlugVal(e.target.value)} required />
          </FieldWrap>
          <FieldWrap label="Topic"><Input name="topic" defaultValue={c.topic} placeholder="Craft, Tech, Life…" /></FieldWrap>
          <FieldWrap label="Cover Image"><ImageUpload name="imageUrl" defaultValue={c.imageUrl} /></FieldWrap>
          <FieldWrap label="Body (Markdown)"><Textarea name="bodyMd" defaultValue={c.bodyMd} style={{ minHeight: 200 }} required /></FieldWrap>
          <FieldWrap label="Publish Date"><Input name="publishedAt" type="date" defaultValue={c.publishedAt ? new Date(c.publishedAt).toISOString().slice(0,10) : today} /></FieldWrap>
          <ToggleField name="isNew" label="Mark as New" defaultChecked={c.isNew} />
          <ToggleField name="published" label="Published (live)" defaultChecked={c.published} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
