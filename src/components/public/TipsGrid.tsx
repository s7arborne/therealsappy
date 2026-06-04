export function TipsGrid({ name }: { name: string }) {
  const tips = [
    <>Use keyboard shortcuts <strong>1 → 6</strong> to move between sections.</>,
    <>New here? Find projects, games, and thoughts below.</>,
    <>Looking for my work? Latest builds in <a href="#projects" style={{ color: "var(--fg)", borderBottom: "1px solid var(--accent)", paddingBottom: 1 }}>Projects →</a></>,
    <>Curious how I spend free time? <a href="#games" style={{ color: "var(--fg)", borderBottom: "1px solid var(--accent)", paddingBottom: 1 }}>Playing</a> and <a href="#watched" style={{ color: "var(--fg)", borderBottom: "1px solid var(--accent)", paddingBottom: 1 }}>watching →</a></>,
  ];
  return (
    <div className="tips-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "34px 30px", marginTop: 72 }}>
      {tips.map((tip, i) => (
        <p key={i} className={i % 4 !== 0 ? "tip-bordered" : ""}
          style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55,
            paddingLeft: i % 4 === 0 ? 0 : 24,
            borderLeft: i % 4 === 0 ? "none" : "1px solid var(--line)" }}>
          {tip}
        </p>
      ))}
    </div>
  );
}
