import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_HOME_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";

export default async function Home() {
  const sections = (await getPage("home")) ?? DEFAULT_HOME_SECTIONS;

  return (
    <main>
      <SectionRenderer sections={sections} />
    </main>
  );
}
