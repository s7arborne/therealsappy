import { getSiteSettings, getSocials } from "@/lib/content";
import { Sidebar } from "@/components/public/Sidebar";
import { Aurora } from "@/components/public/Aurora";
import { MobileNav } from "@/components/public/MobileNav";
import { KeyboardNav } from "@/components/public/KeyboardNav";
import { ContactModal } from "@/components/public/ContactModal";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    getSocials(),
  ]);

  const logoText = settings?.logoText ?? "Sappy";

  return (
    <>
      <Aurora />
      <Sidebar logoText={logoText} socials={socials} />
      <MobileNav logoText={logoText} socials={socials} />
      <main className="site-main">
        <div className="site-panel">
          {children}
        </div>
      </main>
      <KeyboardNav />
      <ContactModal socials={socials} />
    </>
  );
}
