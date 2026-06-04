import Link from "next/link";

export function TipsGrid({ name }: { name: string }) {
  void name;
  const linkStyle = { color: "var(--fg)", borderBottom: "1px solid var(--accent)", paddingBottom: 1 };
  const tips = [
    <>Use keyboard shortcuts <strong>1 → 6</strong> to move between sections.</>,
    <>New here? Find projects, games, and thoughts below.</>,
    <>Looking for my work? Latest builds in <Link href="/projects" style={linkStyle}>Projects →</Link></>,
    <>Curious how I spend free time? <Link href="/games" style={linkStyle}>Playing</Link> and <Link href="/watched" style={linkStyle}>watching →</Link></>,
  ];
  return (
    <div className="tips-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "34px 30px", marginTop: 72 }}>
      {tips.map((tip, i) => (
        <p key={i} className={i % 4 !== 0 ? "tip-bordered" : ""}
          style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.55,
            paddingLeft: i % 4 === 0 ? 0 : 24,
            borderLeft: i % 4 === 0 ? "none" : "1px solid var(--line)" }}>
          {tip}
        </p>
      ))}
    </div>
  );
}
