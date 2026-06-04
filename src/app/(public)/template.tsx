"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// A template re-mounts on every navigation, so the entrance animation replays
// and we can reset the panel's scroll position for each new page.
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelector(".site-panel")?.scrollTo({ top: 0 });
  }, [pathname]);
  return <div className="page-enter">{children}</div>;
}
