import { getThought, getPublishedThoughts } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const thoughts = await getPublishedThoughts();
  return thoughts.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) return {};
  return { title: thought.title, description: thought.topic };
}

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) notFound();

  const html = renderMarkdown(thought.bodyMd);

  return (
    <article>
      <Link href="/" style={{ color: "var(--muted)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 32 }}>
        ← Back
      </Link>
      <div style={{ display: "flex", gap: 12, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>
        {thought.isNew && <span style={{ color: "var(--accent)" }}>● New</span>}
        {thought.topic && <span>{thought.topic}</span>}
        {thought.publishedAt && <span>{format(new Date(thought.publishedAt), "MMM d, yyyy")}</span>}
      </div>
      <h1 style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 32 }}>
        {thought.title}
      </h1>
      {thought.imageUrl && (
        <Image src={thought.imageUrl} alt={thought.title} width={1200} height={630}
          style={{ width: "100%", height: "auto", borderRadius: 14, marginBottom: 32, border: "1px solid var(--glass-bd)" }} />
      )}
      <div
        className="prose-content"
        style={{ color: "var(--muted)", maxWidth: "65ch", lineHeight: 1.75 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
