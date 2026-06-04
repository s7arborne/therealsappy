import { getUpdates } from "@/lib/content";
import { UpdateCard } from "@/components/public/UpdateCard";
import { PageHeader } from "@/components/public/PageHeader";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Updates" };

export default async function UpdatesPage() {
  const updates = await getUpdates();
  return (
    <>
      <PageHeader title="Updates" intro="What I've been up to lately — new roles, talks, milestones, and the occasional ship." />
      <div className="updates-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {updates.map(u => <UpdateCard key={u.id} update={u} />)}
      </div>
    </>
  );
}
