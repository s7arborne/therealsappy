import Link from "next/link";
import type { ReactNode } from "react";

interface SectionEntryProps {
  meta?: string;       // left gutter (date / status / category)
  title: string;
  description?: string;
  tag?: string;        // small chip beside the title
  href?: string;
  thumb?: ReactNode;   // optional leading visual (e.g. game cover)
}

export function SectionEntry({ meta, title, description, tag, href, thumb }: SectionEntryProps) {
  const card = (
    <div className="entry-card">
      <div className="entry-body">
        {thumb && <div className="entry-thumb">{thumb}</div>}
        <div className="entry-content">
          <div className="entry-head">
            <h3 className="entry-title">{title}</h3>
            {tag && <span className="entry-tag">{tag}</span>}
          </div>
          {description && <p className="entry-desc">{description}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="entry">
      <div className="entry-meta">{meta}</div>
      {href ? (
        href.startsWith("/") ? (
          <Link href={href} className="entry-link">{card}</Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer" className="entry-link">{card}</a>
        )
      ) : card}
    </div>
  );
}
