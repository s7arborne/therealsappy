"use client";
import { useState, useTransition } from "react";
import { FieldWrap, Input, Textarea, CheckboxField, SubmitButton } from "@/components/admin/FormField";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { AdminTable } from "@/components/admin/AdminTable";
import { updateSettings, createSocial, updateSocial, deleteSocial } from "@/lib/actions/settings";
import { toast } from "sonner";
import type { SiteSettings, Social } from "@prisma/client";
import { useRouter } from "next/navigation";

export function SettingsClient({ settings, socials }: { settings: SiteSettings | null; socials: Social[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);
  const [creatingS, setCreatingS] = useState(false);

  const s = settings ?? { id: "default", name: "", logoText: "", tagline: "", introMd: "", githubEnabled: false, letterboxdEnabled: false, updatedAt: new Date() };

  const handleSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateSettings({
          name: fd.get("name") as string,
          logoText: fd.get("logoText") as string,
          tagline: fd.get("tagline") as string || "",
          introMd: fd.get("introMd") as string || "",
          githubEnabled: fd.get("githubEnabled") === "on",
          letterboxdEnabled: fd.get("letterboxdEnabled") === "on",
        });
        toast.success("Settings saved"); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const handleSocialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      platform: fd.get("platform") as string,
      label: fd.get("label") as string,
      url: fd.get("url") as string,
      handle: fd.get("handle") as string || "",
      visible: fd.get("visible") === "on",
      order: Number(fd.get("order") || 0),
    };
    startTransition(async () => {
      try {
        if (editingSocial) await updateSocial(editingSocial.id, data);
        else await createSocial(data);
        toast.success("Saved"); setEditingSocial(null); setCreatingS(false); router.refresh();
      } catch { toast.error("Failed"); }
    });
  };

  const socialCols = [
    { key: "platform", header: "Platform" },
    { key: "label", header: "Label" },
    { key: "url", header: "URL" },
    { key: "order", header: "Order" },
  ];

  const cs = editingSocial ?? { id: "", platform: "", label: "", url: "", handle: "", visible: true, order: socials.length };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Settings</h1>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Site Identity</h2>
        <form onSubmit={handleSettings} style={{ maxWidth: 520 }}>
          <FieldWrap label="Display Name"><Input name="name" defaultValue={s.name} required /></FieldWrap>
          <FieldWrap label="Logo Text (Caveat font)"><Input name="logoText" defaultValue={s.logoText} required /></FieldWrap>
          <FieldWrap label="Tagline"><Input name="tagline" defaultValue={s.tagline} /></FieldWrap>
          <FieldWrap label="Intro (Markdown)"><Textarea name="introMd" defaultValue={s.introMd} style={{ minHeight: 100 }} /></FieldWrap>
          <CheckboxField label="GitHub integration enabled" checked={s.githubEnabled} onChange={() => {}} />
          <input name="githubEnabled" type="checkbox" defaultChecked={s.githubEnabled} style={{ display: "none" }} />
          <CheckboxField label="Letterboxd integration enabled" checked={s.letterboxdEnabled} onChange={() => {}} />
          <input name="letterboxdEnabled" type="checkbox" defaultChecked={s.letterboxdEnabled} style={{ display: "none" }} />
          <SubmitButton loading={pending} />
        </form>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Social Links</h2>
          <button onClick={() => setCreatingS(true)} style={{ padding: "7px 14px", borderRadius: 9, background: "var(--fg)", color: "var(--bg)", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>+ Add Social</button>
        </div>
        <AdminTable data={socials} columns={socialCols} onEdit={setEditingSocial}
          onDelete={async id => { await deleteSocial(id); router.refresh(); }}
          onToggleVisible={async (id, v) => { await updateSocial(id, { ...socials.find(s => s.id === id)!, visible: v }); router.refresh(); }} />
        <AdminDialog title={editingSocial ? "Edit Social" : "Add Social"} open={!!editingSocial || creatingS} onClose={() => { setEditingSocial(null); setCreatingS(false); }}>
          <form onSubmit={handleSocialSubmit}>
            <FieldWrap label="Platform (e.g. twitter, github, email)"><Input name="platform" defaultValue={cs.platform} required /></FieldWrap>
            <FieldWrap label="Label"><Input name="label" defaultValue={cs.label} required /></FieldWrap>
            <FieldWrap label="URL"><Input name="url" defaultValue={cs.url} required /></FieldWrap>
            <FieldWrap label="Handle"><Input name="handle" defaultValue={cs.handle} /></FieldWrap>
            <FieldWrap label="Order"><Input name="order" type="number" defaultValue={cs.order} /></FieldWrap>
            <CheckboxField label="Visible" checked={cs.visible} onChange={() => {}} />
            <input name="visible" type="checkbox" defaultChecked={cs.visible} style={{ display: "none" }} />
            <SubmitButton loading={pending} />
          </form>
        </AdminDialog>
      </section>
    </div>
  );
}
