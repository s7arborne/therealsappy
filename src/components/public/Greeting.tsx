"use client";
import { useEffect, useState } from "react";

// Fun, nerd-themed late-night greetings — one is picked per calendar date
// (stable all day, changes from one date to the next), not re-randomized on
// every visit. Themes: Spider-Man, Batman, Ryan Gosling, James Bond,
// Initial D, JoJo's Bizarre Adventure, Cyberpunk, Formula 1, Hideo Kojima.
const NIGHT_GREETINGS = [
  // Spider-Man
  "Your friendly neighborhood night owl",
  "Spidey-sense says go to sleep",
  "Doing whatever a spider can, at 3am",
  "Anyone can wear the mask — even at 4am",
  // Batman
  "Why do we fall? To stay up till 3am",
  "The night is darkest just before the dawn",
  "The Long Halloween, every single night",
  "The Court of Owls never sleeps",
  // Ryan Gosling
  "Literally me at 3am",
  "And I'm just Ken, wide awake",
  "Cells. Interlinked.",
  "More human than human, still awake",
  // James Bond
  "Shaken, not slept",
  "No time to sleep",
  "You only sleep twice",
  "Universal Exports, night shift",
  // Initial D
  "Tofu delivery hours",
  "Don't spill the cup",
  "Gutter run, headlights off on Akina",
  "Hachi-Roku still warming up",
  // JoJo's Bizarre Adventure
  "Your next line is: I should sleep",
  "Roundabout — the long way to bed",
  "Heaven's Door says go to sleep",
  // Cyberpunk
  "Wake up, Samurai — we have a city to burn",
  "Night City never sleeps, choom",
  "Burning chrome at 3am",
  // Formula 1
  "Lights out and away we go",
  "Box, box — but for sleep",
  "Leave me alone, I know what I'm doing",
  // Hideo Kojima
  "Kept you waiting, huh?",
  "War has changed",
  "Keep on keeping on",
  "Building bridges, not sleeping",
  "La-Li-Lu-Le-Lo never sleep",
];

// Deterministic per-date pick: hash the YYYY-M-D string into an array index.
function nightGreetingForDate(now: Date) {
  const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return NIGHT_GREETINGS[hash % NIGHT_GREETINGS.length];
}

function getGreeting() {
  const now = new Date();
  const h = now.getHours();
  if (h >= 7 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  // Night: 21:00–06:59
  return nightGreetingForDate(now);
}

export function Greeting({ introHtml }: { introHtml: string }) {
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => { setGreeting(getGreeting()); }, []);

  // Use the greeting's own trailing punctuation as the accent mark
  // (e.g. "still awake?"), defaulting to a period when there is none.
  const accent = greeting.match(/[.!?…]+$/)?.[0] ?? ".";
  const text = greeting.replace(/[.!?…]+$/, "");

  return (
    <header id="home">
      <h1 style={{ fontSize: "clamp(42px,8vw,112px)", fontWeight: 500, letterSpacing: "-.035em", lineHeight: .96 }}>
        {text}<span style={{ color: "var(--accent)" }}>{accent}</span>
      </h1>
      <div
        style={{ color: "var(--muted)", fontSize: "clamp(13.5px,1.25vw,16px)", marginTop: 22, maxWidth: "60ch" }}
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />
    </header>
  );
}
