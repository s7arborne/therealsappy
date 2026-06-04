"use client";
import { useEffect } from "react";

export function ScrollBehavior() {
  useEffect(() => {
    // Keyboard shortcuts
    const map: Record<string, string> = { "1": "home", "2": "updates", "3": "projects", "4": "games", "5": "thoughts", "6": "watched" };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,textarea")) return;
      const id = map[e.key];
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);

    // Scroll reveal
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach(el => io.observe(el));

    // Scrollspy
    const spyItems = [...document.querySelectorAll<HTMLAnchorElement>("[data-spy]")];
    const spyIO = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            spyItems.forEach(a => {
              const active = a.dataset.spy === e.target.id;
              a.style.color = active ? "var(--fg)" : "";
              a.style.background = active ? "var(--glass)" : "";
              a.style.borderColor = active ? "var(--glass-bd)" : "transparent";
              a.style.boxShadow = active ? "inset 0 1px 0 var(--glass-hi), 0 10px 26px rgba(0,0,0,.28)" : "";
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spyItems.forEach(a => {
      const sec = document.getElementById(a.dataset.spy ?? "");
      if (sec) spyIO.observe(sec);
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      io.disconnect();
      spyIO.disconnect();
    };
  }, []);

  return null;
}
