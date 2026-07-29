import Badge from "../../ui/Badge";
import { ChefIcon, Link01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const cardsData = [
  {
    title: "Drop a video link",
    icon: ChefIcon,
    description:
      "Drop a TikTok, Instagram, YouTube, or Facebook video link. Get a full ingredient list and step-by-step instructions in seconds.",
  },
  {
    title: "Extract recipe",
    icon: SparklesIcon,

    description:
      "AI-powered recipe extraction. Turn any cooking video into a recipe in seconds.",
  },
  {
    title: "Share recipe",
    icon: Link01Icon,
    description:
      "Get a shareable link for any recipe. Send it to friends, family, or your cooking group in one click.",
  },
];

const HowItWorks = () => {
  return (
    <div className="px-[20px] py-[80px] md:p-[80px] lg:p-[122px]">
      <div className="flex flex-col items-center text-center gap-[10px] mb-[40px] md:mb-[50px] md:max-w-[620px] mx-auto">
        <Badge>How it works</Badge>
        <h2 className="font-heading text-2xl md:text-4xl">Three steps to cook anything</h2>
        <p className="text-sm opacity-60">
          No more pausing videos or scribbling notes. Get perfect recipes from
          any cooking video in seconds.
        </p>
      </div>
      <div className="gap-[25px] flex flex-col relative md:hidden">
        <div className="flex items-center gap-[10px] relative">
          <div className="h-[calc(100%+25px)] border border-dashed border-accent-primary absolute left-[20px] top-0 z-0"></div>
          <span className="flex-shrink-0 bg-accent-primary text-white font-bold rounded-full z-10 w-[40px] h-[40px] flex items-center justify-center text-lg">
            1
          </span>
          <div className="bg-card border border-border-default p-[15px] flex flex-col gap-[15px] rounded-2xl">
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-[7px] bg-page border border-border-default flex items-center justify-center">
                <HugeiconsIcon
                  icon={Link01Icon}
                  size={20}
                  strokeWidth={2}
                  className="text-accent-primary"
                />
              </div>
              <h3 className="text-lg font-bold">Paste the link</h3>
            </div>
            <p className="text-sm opacity-60">
              See a recipe video on TikTok, Instagram, YouTube, or Facebook?
              Copy the link and paste it into Dish Drop.
            </p>
          </div>
        </div>
        <div className="w-[calc(100%-40px)] mx-auto border border-dashed border-accent-primary" />
        <div className="flex items-center gap-[10px] flex-row-reverse relative">
          <div className="h-[calc(100%+50px)] border border-dashed border-accent-primary absolute right-[20px] top-[-25px] z-0"></div>
          <span className="z-10 flex-shrink-0 bg-accent-primary text-white font-bold rounded-full w-[40px] h-[40px] flex items-center justify-center text-lg">
            2
          </span>
          <div className="bg-card border border-border-default p-[15px] flex flex-col gap-[15px] rounded-2xl">
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-[7px] bg-page border border-border-default flex items-center justify-center">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={20}
                  strokeWidth={2}
                  className="text-accent-primary fill-accent-primary"
                />
              </div>
              <h3 className="text-lg font-bold">AI does the magic</h3>
            </div>
            <p className="text-sm opacity-60">
              Our AI watches the video, extracts every ingredient and
              measurement, and writes out each step clearly.
            </p>
          </div>
        </div>
        <div className="w-[calc(100%-40px)] mx-auto border border-dashed border-accent-primary" />
        <div className="flex items-center gap-[10px] relative">
          <div className="h-[calc(100%+25px)] border border-dashed border-accent-primary absolute left-[20px] top-[-25px] z-0"></div>
          <span className="z-10 flex-shrink-0 bg-accent-primary text-white font-bold rounded-full w-[40px] h-[40px] flex items-center justify-center text-lg">
            3
          </span>
          <div className="bg-card border border-border-default p-[15px] flex flex-col gap-[15px] rounded-2xl">
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-[7px] bg-page border border-border-default flex items-center justify-center">
                <HugeiconsIcon
                  icon={ChefIcon}
                  size={22}
                  strokeWidth={2}
                  className="text-accent-primary"
                />
              </div>
              <h3 className="text-lg font-bold">Cook with confidence</h3>
            </div>
            <p className="text-sm opacity-60">
              Save the recipe to your profile, share it with friends, or start
              cooking right away with your organized recipe.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <hr className="w-[calc(100%-40px)] mx-auto border border-dashed border-accent-primary" />
        <div className="grid grid-cols-3 gap-[25px] relative -mt-[20px]">
        {cardsData.map((step, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center gap-[10px] relative"
          >
            <span className="flex-shrink-0 bg-accent-primary text-white font-bold rounded-full z-10 w-[40px] h-[40px] flex items-center justify-center text-lg">
              {index + 1}
            </span>
            <div className="bg-card border border-border-default p-[15px] flex flex-col gap-[15px] rounded-2xl h-full">
              <div className="flex items-center gap-[10px]">
                <div className="w-[35px] h-[35px] rounded-[7px] bg-page border border-border-default flex items-center justify-center">
                  <HugeiconsIcon
                    icon={step.icon}
                    size={22}
                    strokeWidth={2}
                    className="text-accent-primary"
                  />
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
              </div>
              <p className="text-sm opacity-60">{step.description}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
