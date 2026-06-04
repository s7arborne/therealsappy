import type { Metadata } from "next";
import { Hanken_Grotesk, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// To swap to a licensed font: replace this with next/font/local and point to the font file
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Saptarshi Mondal", template: "%s · Saptarshi Mondal" },
  description: "Builder, thinker, perpetual tinkerer.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Saptarshi Mondal",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hanken.variable} ${caveat.variable}`}
        style={{ fontFamily: "var(--font-hanken, var(--sans))" }}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark"]}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
