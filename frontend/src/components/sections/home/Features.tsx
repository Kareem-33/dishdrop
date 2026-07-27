import { ArrangeIcon, Bookmark02Icon, ClipboardListIcon, Globe02Icon, Share01Icon, ZapIcon } from "@hugeicons/core-free-icons";
import Badge from "../../ui/Badge";
import FeaturesCard from "../../ui/Home/FeaturesCard";

const cardsData = [
  {
    icon: ClipboardListIcon,
    title: "Perfect ingredient lists",
    description: `Every amount, unit, and ingredient clearly listed. No more guessing "a pinch" or "some salt."`,
  },
  {
    icon: ArrangeIcon,
    title: "Clear step-by-step",
    description: `Follow along with numbered, detailed instructions. Each step is written like a real recipe card.`,
  },
  {
    icon: ZapIcon,
    title: "Lightning fast",
    description: `Get your recipe in under 10 seconds. No waiting, no manual transcription, just instant results.`,
  },
  {
    icon: Bookmark02Icon,
    title: "Save & organize",
    description: `Build your personal recipe library. Save any recipe you generate and access it anytime, anywhere.`,
  },
  {
    icon: Share01Icon,
    title: "Share instantly",
    description: `Get a shareable link for any recipe. Send it to friends, family, or your cooking group in one click.`,
  },
  {
    icon: Globe02Icon,
    title: "Multi-platform",
    description: `Works with TikTok, Instagram Reels, YouTube Shorts, Facebook videos, and more. One tool for everything.`,
  },
];

const Features = () => {
  return (
    <div className="bg-card px-[20px] py-[80px] md:p-[122px]">
      <div className="flex flex-col items-center gap-[10px] mb-[40px] max-w-[620px] mx-auto">
        <Badge>Features</Badge>
        <h2 className="font-heading text-2xl md:text-4xl">Everything you need to cook</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {cardsData.map((card, index) => (
          <FeaturesCard
            key={index}
            count={index + 1}
            title={card.title!}
            icon={card.icon!}
          >
            {card.description}
          </FeaturesCard>
        ))}
      </div>
    </div>
  );
};

export default Features;
