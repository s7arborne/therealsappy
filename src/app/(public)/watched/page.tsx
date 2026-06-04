import { getWatched } from "@/lib/content";
import { WatchedRow } from "@/components/public/WatchedRow";
import { PageHeader } from "@/components/public/PageHeader";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Watched" };

export default async function WatchedPage() {
  const watched = await getWatched();
  return (
    <>
      <PageHeader title="Watched" intro="Films and shows I've been watching lately — usually at hours I shouldn't be awake." />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {watched.map(w => <WatchedRow key={w.id} w={w} />)}
      </div>
    </>
  );
}
