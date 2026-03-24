import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata: Metadata = {
  title: { default: "Docs", template: "%s | Skill Shope Docs" },
  description: "Documentation for Skill Shope — the AI skills registry.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6">
      <DocsSidebar />
      <article className="min-w-0 max-w-3xl flex-1">{children}</article>
    </div>
  );
}
