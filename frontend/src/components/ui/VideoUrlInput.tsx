import { AiMagicIcon } from "@hugeicons/core-free-icons";
import Button from "./Button";
import Input from "./Input";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import SocialMediaBadge from "./SocialMediaBadge";
import useRecipeStore from "../../stores/useRecipeStore";
import { useEffect, useState } from "react";

export const platforms = [
  { name: "YouTube", icon: "/icons/youtube.svg", className: `bg-[#ff0000]` },
  { name: "Tiktok", icon: "/icons/tiktok.svg", className: `bg-[#000000]` },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  { name: "Facebook", icon: "/icons/facebook.svg", className: `bg-[#2D83F3]` },
];

interface VideoUrlInputProps {
  className?: string;
}

const VideoUrlInput = ({ className = "" }: VideoUrlInputProps) => {
  const navigate = useNavigate();
  const { loading, analyzedId, analyzeRecipe } = useRecipeStore();
  const [videoLink, setVideoLink] = useState("");
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const handleGetRecipe = async () => {
    await analyzeRecipe(videoLink);
  };

  useEffect(() => {
    setShowLoadingModal(loading);
    document.body.style.overflow = loading ? "hidden" : "auto";
  }, [loading]);

  useEffect(() => {
  if (analyzedId) {
    navigate(`/r/${analyzedId}`);
  }
}, [analyzedId, navigate]);

  return (
    <div
      className={`bg-card border border-border-default rounded-lg p-4 ${className}`}
    >
      {showLoadingModal && (
        <div>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/15 bg-opacity-50" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 bg-card border border-border-default rounded-lg p-4">
            <div className="w-[150px] h-[150px] flex flex-col gap-[20px] items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
              <p className="text-sm opacity-60">Analyzing video...</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-end gap-0 ">
        <Input
          placeholder="Paste video URL here..."
          className=" flex-1"
          inputClassName="rounded-r-none"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        <Button
          variant="primary"
          size="md"
          className="h-[41px] flex-shrink-0 rounded-l-none px-[10px]!"
          onClick={handleGetRecipe}
        >
          <HugeiconsIcon
            icon={AiMagicIcon}
            className="fill-dark-text"
            size={18}
          />
          Get Recipe
        </Button>
      </div>
      <div className="flex flex-col mt-[10px] gap-1">
        <p className="text-sm opacity-60">Works with:</p>
        <div className="flex items-center gap-1 max-w-full flex-wrap">
          {platforms.map((platform) => (
            <SocialMediaBadge
              name={platform.name}
              className={platform.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoUrlInput;
