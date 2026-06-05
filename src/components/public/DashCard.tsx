import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface DashCardProps {
  href: string;
  icon?: ReactNode;
  image?: string;       // when set, renders an image-forward "media" card
  title: string;
  subtitle?: string;
  meta?: string;
}

export function DashCard({ href, icon, image, title, subtitle, meta }: DashCardProps) {
  const internal = href.startsWith("/");

  // Media variant: big image fills the card, only the title (+ small meta) shows.
  const inner = image ? (
    <>
      <span className="dash-media">
        <Image src={image} alt="" fill sizes="(max-width:620px) 100vw, (max-width:1100px) 50vw, 25vw" style={{ objectFit: "cover" }} />
      </span>
      <div className="dash-media-foot">
        <h3 className="dash-title">{title}</h3>
        {meta && <span className="dash-meta">{meta}</span>}
      </div>
    </>
  ) : (
    <>
      {icon && <span className="dash-icon">{icon}</span>}
      <h3 className="dash-title">{title}</h3>
      {subtitle && <p className="dash-sub">{subtitle}</p>}
      <span className="dash-spacer" />
      {meta && <span className="dash-meta">{meta}</span>}
    </>
  );

  const className = image ? "dash-card dash-card-media" : "dash-card";

  if (internal) {
    return <Link href={href} className={className}>{inner}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}
