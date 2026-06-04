import { getProjects } from "@/lib/content";
import { ProjectList } from "@/components/public/ProjectList";
import { PageHeader } from "@/components/public/PageHeader";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHeader title="Projects" intro="Things I've designed and built — products I work on, side projects, and experiments that escaped the lab." />
      <ProjectList projects={projects} />
    </>
  );
}
