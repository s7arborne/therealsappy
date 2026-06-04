export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header style={{ marginBottom: 48 }}>
      <h1 style={{ fontSize: "clamp(34px,5vw,56px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1 }}>
        {title}
      </h1>
      {intro && (
        <p style={{ color: "var(--muted)", fontSize: "clamp(13.5px,1.25vw,16px)", marginTop: 18, maxWidth: "62ch", lineHeight: 1.6 }}>
          {intro}
        </p>
      )}
    </header>
  );
}
