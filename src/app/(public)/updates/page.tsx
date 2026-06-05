import { getUpdates } from "@/lib/content";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionEntry } from "@/components/public/SectionEntry";
import { format } from "date-fns";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Updates" };

export default async function UpdatesPage() {
  const updates = await getUpdates();
  return (
    <SectionShell title="Updates" intro="What I've been up to lately — new roles, talks, milestones, and the occasional ship.">
      {updates.map(u => (
        <SectionEntry key={u.id}
          meta={format(new Date(u.date), "MMM yyyy")}
          title={u.title}
          description={u.description}
          href={u.link || undefined} />
      ))}
    </SectionShell>
  );
}
