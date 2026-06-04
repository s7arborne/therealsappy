"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Number shortcuts 1–6 jump straight to each section's page.
export const NAV_ROUTES = ["/", "/updates", "/projects", "/games", "/thoughts", "/watched"];

export function KeyboardNav() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest("input,textarea,[contenteditable='true']")) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= NAV_ROUTES.length) {
        e.preventDefault();
        router.push(NAV_ROUTES[n - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
