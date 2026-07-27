import { HugeiconsIcon } from "@hugeicons/react";
import Badge from "../../ui/Badge";
import { AiMagicIcon } from "@hugeicons/core-free-icons";
import VideoUrlInput from "../../ui/VideoUrlInput";

const Hero = () => {
  return (
    <div className="relative px-[20px] md:p-[122px] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      <div>
        <img
          src="./ingredients_card.svg"
          alt="Ingredients Card"
          className="absolute top-0 left-[-90%] md:left-[-10%] z-0 rotate-[15deg] blur-xs shadow-lg"
        />
        <img
          src="./ingredients_card.svg"
          alt="Ingredients Card"
          className="absolute top-50px right-[-90%] md:top-0 md:right-[-10%] z-0 rotate-[-15deg] blur-xs shadow-lg"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-[10px] text-center mb-[40px] md:max-w-[650px]">
        <Badge>
          <HugeiconsIcon
            icon={AiMagicIcon}
            className="fill-accent-primary"
            size={20}
          />
          AI-powered recipe extraction
        </Badge>
        <h1 className="text-5xl md:text-6xl text-center font-heading ">
          Turn any cooking video into a <span className="text-accent-primary font-heading">recipe</span> instantly
        </h1>
        <p className=" text-center text-text-primary/60">
          Drop a TikTok, Instagram, YouTube, or Facebook video link. Get a full
          ingredient list and step-by-step instructions in seconds.
        </p>
      </div>
      <VideoUrlInput className="md:w-[800px]" />
    </div>
  );
};

export default Hero;
