export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  await requireAdmin();
  const projects = await db.project.findMany({ orderBy: { order: "asc" } });
  return <ProjectsClient projects={projects} />;
}
