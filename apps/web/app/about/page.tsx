import type { Metadata } from "next";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_ABOUT_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "About",
  description: "About ASF Agro Industry — our story, vision and principles.",
};

export default async function About() {
  const sections = (await getPage("about")) ?? DEFAULT_ABOUT_SECTIONS;

  return (
    <main>
      <SectionRenderer sections={sections} />
    </main>
  );
}
