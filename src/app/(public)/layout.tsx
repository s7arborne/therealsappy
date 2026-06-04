import { getSiteSettings, getSocials, getCounts } from "@/lib/content";
import { Sidebar } from "@/components/public/Sidebar";
import { Aurora } from "@/components/public/Aurora";
import { MobileNav } from "@/components/public/MobileNav";
import { ScrollBehavior } from "@/components/public/ScrollBehavior";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, socials, counts] = await Promise.all([
    getSiteSettings(),
    getSocials(),
    getCounts(),
  ]);

  const logoText = settings?.logoText ?? "Sappy";

  return (
    <>
      <Aurora />
      <Sidebar logoText={logoText} socials={socials} counts={counts} />
      <MobileNav logoText={logoText} socials={socials} />
      <main
        className="site-main"
        style={{ position: "relative", zIndex: 10, marginLeft: "var(--sb)", padding: "8px 8px 8px 0" }}
      >
        <div style={{
          background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 22,
          minHeight: "calc(100vh - 16px)", padding: "64px clamp(28px,4.5vw,72px) 70px",
        }}>
          {children}
        </div>
      </main>
      <ScrollBehavior />
    </>
  );
}
