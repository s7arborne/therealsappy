import type { Game } from "@prisma/client";
import Image from "next/image";

const GAME_EMOJI: Record<string, string> = {
  "Now Playing": "🎮", "Completed": "🕹️", "100%'d": "👾", "On Deck": "⚔️", "Backlog": "📦",
};

export function GameCard({ game }: { game: Game }) {
  const isActive = game.status === "Now Playing" || game.status === "On Deck";
  const emoji = GAME_EMOJI[game.status] ?? "🎮";
  return (
    <div className="glass game-card" style={{ padding: 16, display: "flex", gap: 14 }}>
      <span style={{ width: 50, height: 66, borderRadius: 5, background: "var(--glass)", border: "1px solid var(--glass-bd)", flex: "none",
        display: "grid", placeItems: "center", fontSize: 18, overflow: "hidden" }}>
        {game.coverUrl ? (
          <Image src={game.coverUrl} alt={game.title} width={50} height={66} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : emoji}
      </span>
      <div>
        <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{game.title}</div>
        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{game.platform}{game.genre ? ` · ${game.genre}` : ""}</div>
        <span style={{ display: "inline-block", marginTop: 10, fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em",
          color: isActive ? "var(--accent)" : "var(--muted)", border: `1px solid ${isActive ? "var(--accent)" : "var(--line)"}`,
          borderRadius: 6, padding: "2px 9px" }}>
          {game.status}
        </span>
      </div>
    </div>
  );
}
