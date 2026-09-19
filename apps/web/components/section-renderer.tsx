import { PageSection } from "@/lib/sections";
import Hero from "@/components/sections/hero";
import MissionGlance from "@/components/sections/mission-glance";
import FeatureGrid from "@/components/sections/feature-grid";
import StatsBand from "@/components/sections/stats-band";
import Intro from "@/components/sections/intro";
import StoryPanel from "@/components/sections/story-panel";
import Video from "@/components/sections/video";

export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.__component) {
          case "sections.hero":
            return <Hero key={index} section={section} />;
          case "sections.mission-glance":
            return <MissionGlance key={index} section={section} />;
          case "sections.feature-grid":
            return <FeatureGrid key={index} section={section} />;
          case "sections.stats-band":
            return <StatsBand key={index} section={section} />;
          case "sections.intro":
            return <Intro key={index} section={section} />;
          case "sections.story-panel":
            return <StoryPanel key={index} section={section} />;
          case "sections.video":
            return <Video key={index} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
