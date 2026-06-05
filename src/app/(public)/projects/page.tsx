import { getProjects } from "@/lib/content";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionEntry } from "@/components/public/SectionEntry";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <SectionShell title="Projects" intro="Things I've designed and built — products I work on, side projects, and experiments that escaped the lab.">
      {projects.map(p => (
        <SectionEntry key={p.id}
          meta={p.tag || undefined}
          title={p.title}
          description={p.description || undefined}
          thumb={p.imageUrl
            ? <Image src={p.imageUrl} alt="" width={56} height={56} style={{ width: 56, height: 56, borderRadius: 6, objectFit: "cover" }} />
            : undefined}
          href={p.url || undefined} />
      ))}
    </SectionShell>
  );
}
