"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Newspaper, FolderGit2, Gamepad2, Film, PenLine, Settings,
} from "lucide-react";
import type { ComponentType } from "react";

interface NavItem { href: string; label: string; Icon: ComponentType<{ size?: number }>; }

const NAV: NavItem[] = [
  { href: "", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/updates", label: "Updates", Icon: Newspaper },
  { href: "/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/games", label: "Games", Icon: Gamepad2 },
  { href: "/watched", label: "Watched", Icon: Film },
  { href: "/thoughts", label: "Thoughts", Icon: PenLine },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function AdminNav({ basePath }: { basePath: string }) {
  const pathname = usePathname();
  const root = `/${basePath}`;

  return (
    <nav style={{ flex: 1 }}>
      {NAV.map(({ href, label, Icon }) => {
        const full = `${root}${href}`;
        const active = href === "" ? pathname === root : pathname.startsWith(full);
        return (
          <Link key={href} href={full} className={`admin-nav-link${active ? " active" : ""}`}>
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
