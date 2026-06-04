interface SectionHeaderProps {
  title: string;
  linkLabel?: string;
  linkHref?: string;
  linkTarget?: string;
  linkRel?: string;
}

export function SectionHeader({ title, linkLabel, linkHref, linkTarget, linkRel }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.02em" }}>{title}</h2>
      {linkLabel && linkHref && (
        <a href={linkHref} target={linkTarget} rel={linkRel} className="sec-link"
          style={{ fontSize: 13, color: "var(--muted)", transition: "color .2s" }}>
          {linkLabel}
        </a>
      )}
    </div>
  );
}
