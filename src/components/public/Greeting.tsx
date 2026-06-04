"use client";
import { useEffect, useState } from "react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ introHtml }: { introHtml: string }) {
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => { setGreeting(getGreeting()); }, []);

  return (
    <header id="home">
      <h1 style={{ fontSize: "clamp(48px,9vw,128px)", fontWeight: 500, letterSpacing: "-.035em", lineHeight: .96 }}>
        {greeting}<span style={{ color: "var(--accent)" }}>.</span>
      </h1>
      <div
        style={{ color: "var(--muted)", fontSize: "clamp(15px,1.4vw,18px)", marginTop: 22, maxWidth: "60ch" }}
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />
    </header>
  );
}
