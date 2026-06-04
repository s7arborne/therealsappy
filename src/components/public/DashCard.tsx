import Link from "next/link";
import type { ReactNode } from "react";

interface DashCardProps {
  href: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
}

export function DashCard({ href, icon, title, subtitle, meta }: DashCardProps) {
  const internal = href.startsWith("/");
  const inner = (
    <>
      {icon && <span className="dash-icon">{icon}</span>}
      <h3 className="dash-title">{title}</h3>
      {subtitle && <p className="dash-sub">{subtitle}</p>}
      <span className="dash-spacer" />
      {meta && <span className="dash-meta">{meta}</span>}
    </>
  );

  if (internal) {
    return <Link href={href} className="dash-card">{inner}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="dash-card">
      {inner}
    </a>
  );
}
