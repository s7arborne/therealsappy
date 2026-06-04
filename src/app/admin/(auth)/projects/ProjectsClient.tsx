"use client";
import { useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { FieldWrap, Input, Textarea, CheckboxField, SubmitButton } from "@/components/admin/FormField";
import { createProject, updateProject, deleteProject, toggleProjectVisible } from "@/lib/actions/projects";
import { toast } from "sonner";
import type { Project } from "@prisma/client";
import { useRouter } from "next/navigation";

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      tag: fd.get("tag") as string || "",
      url: fd.get("url") as string || "",
      description: fd.get("description") as string || "",
      featured: fd.get("featured") === "on",
      visible: fd.get("visible") === "on",
      order: Number(fd.get("order") || 0),
    };
    startTransition(async () => {
      try {
        if (editing) await updateProject(editing.id, data);
        else await createProject(data);
        toast.success("Saved"); setEditing(null); setCreating(false); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const cols = [
    { key: "title", header: "Title" },
    { key: "tag", header: "Tag" },
    { key: "url", header: "URL", render: (r: Project) => r.url ? <a href={r.url} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>↗</a> : "—" },
    { key: "order", header: "Order" },
  ];

  const c = editing ?? { id: "", title: "", tag: "", url: "", description: "", featured: false, visible: true, order: projects.length };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Projects</h1>
        <button onClick={() => setCreating(true)} style={{ padding: "8px 18px", borderRadius: 10, background: "var(--fg)", color: "var(--bg)", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Project</button>
      </div>
      <AdminTable data={projects} columns={cols} onEdit={setEditing}
        onDelete={async id => { await deleteProject(id); router.refresh(); }}
        onToggleVisible={async (id, v) => { await toggleProjectVisible(id, v); router.refresh(); }} />
      <AdminDialog title={editing ? "Edit Project" : "New Project"} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }}>
        <form onSubmit={handleSubmit}>
          <FieldWrap label="Title"><Input name="title" defaultValue={c.title} required /></FieldWrap>
          <FieldWrap label="Tag"><Input name="tag" defaultValue={c.tag} placeholder="Web" /></FieldWrap>
          <FieldWrap label="URL"><Input name="url" defaultValue={c.url} /></FieldWrap>
          <FieldWrap label="Description"><Textarea name="description" defaultValue={c.description} /></FieldWrap>
          <FieldWrap label="Order"><Input name="order" type="number" defaultValue={c.order} /></FieldWrap>
          <CheckboxField label="Featured" checked={c.featured} onChange={() => {}} />
          <input name="featured" type="checkbox" defaultChecked={c.featured} style={{ display: "none" }} />
          <CheckboxField label="Visible" checked={c.visible} onChange={() => {}} />
          <input name="visible" type="checkbox" defaultChecked={c.visible} style={{ display: "none" }} />
          <SubmitButton loading={pending} />
        </form>
      </AdminDialog>
    </div>
  );
}
