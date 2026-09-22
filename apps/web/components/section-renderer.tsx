import { PageSection } from "@/lib/sections";
import Hero from "@/components/sections/hero";
import Glance from "@/components/sections/glance";
import Mission from "@/components/sections/mission";
import FeatureGrid from "@/components/sections/feature-grid";
import StatsBand from "@/components/sections/stats-band";
import Intro from "@/components/sections/intro";
import StoryPanel from "@/components/sections/story-panel";
import Video from "@/components/sections/video";
import TeamGrid from "@/components/sections/team-grid";
import RichText from "@/components/sections/rich-text";
import Pullquote from "@/components/sections/pullquote";
import ImageBlock from "@/components/sections/image-block";
import GalleryBlock from "@/components/sections/gallery-block";
import Slider from "@/components/sections/slider-block";
import ColumnsBlock from "@/components/sections/columns-block";
import ButtonsBlock from "@/components/sections/buttons-block";
import Spacer from "@/components/sections/spacer";
import Embed from "@/components/sections/embed";

export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.__component) {
          case "sections.hero":
            return <Hero key={index} section={section} />;
          case "sections.glance":
            return <Glance key={index} section={section} />;
          case "sections.mission":
            return <Mission key={index} section={section} />;
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
          case "sections.team-grid":
            return <TeamGrid key={index} section={section} />;
          case "sections.rich-text":
            return <RichText key={index} section={section} />;
          case "sections.pullquote":
            return <Pullquote key={index} section={section} />;
          case "sections.image-block":
            return <ImageBlock key={index} section={section} />;
          case "sections.gallery-block":
            return <GalleryBlock key={index} section={section} />;
          case "sections.slider-block":
            return <Slider key={index} section={section} />;
          case "sections.columns-block":
            return <ColumnsBlock key={index} section={section} />;
          case "sections.buttons-block":
            return <ButtonsBlock key={index} section={section} />;
          case "sections.spacer":
            return <Spacer key={index} section={section} />;
          case "sections.embed":
            return <Embed key={index} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
