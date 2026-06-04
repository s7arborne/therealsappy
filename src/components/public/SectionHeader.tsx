import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  linkLabel?: string;
  linkHref?: string;
  linkTarget?: string;
  linkRel?: string;
}

export function SectionHeader({ title, linkLabel, linkHref, linkTarget, linkRel }: SectionHeaderProps) {
  const isInternal = linkHref?.startsWith("/");
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
      <h2 style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.02em" }}>{title}</h2>
      {linkLabel && linkHref && (
        isInternal ? (
          <Link href={linkHref} className="sec-link" style={{ fontSize: 12, color: "var(--muted)", transition: "color .2s" }}>
            {linkLabel}
          </Link>
        ) : (
          <a href={linkHref} target={linkTarget} rel={linkRel} className="sec-link"
            style={{ fontSize: 12, color: "var(--muted)", transition: "color .2s" }}>
            {linkLabel}
          </a>
        )
      )}
    </div>
  );
}
