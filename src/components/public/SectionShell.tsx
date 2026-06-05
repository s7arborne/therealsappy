import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

export function SectionShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="section-page">
      <div className="section-head">
        <PageHeader title={title} intro={intro} />
      </div>
      <div className="entry-list">{children}</div>
    </div>
  );
}
