import {
  Clock4Icon,
  Trash2,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { platforms } from "../VideoUrlInput";
import SocialMediaBadge from "../SocialMediaBadge";
import useSavedStore from "../../../stores/useSavedStore";
import { useNavigate } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  recipeId: string;
  platform: string;
  imageUrl: string;
  title: string;
  time: string;
  servings: string;
  addDate: Date;
  onUnsave?: () => void;
  deleteBtn?: boolean;
}

const RecipeCard = ({
  id,
  recipeId,
  platform,
  imageUrl,
  title,
  time,
  servings,
  onUnsave,
  deleteBtn=true,
}: RecipeCardProps) => {
  const { unsaveRecipe } = useSavedStore();
  const navigate = useNavigate();

  const platformDetails =
    platform !== "unknown" &&
    platforms.find((p) => p.name.toLowerCase() === platform.toLowerCase());

  return (
    <div
      className="hover:translate-y-[-5px] hover:shadow-lg shadow-accent-primary/15
      hover:border-accent-primary cursor-pointer bg-white rounded-xl border
      border-border-default overflow-hidden relative transition-all duration-300 ease-in-out"
      id={id}
    >
      {platformDetails && (
        <div className="absolute top-[15px] left-[15px] z-10">
          <SocialMediaBadge
            name={platformDetails.name}
            className={platformDetails.className}
          />
        </div>
      )}
      <img
        src={imageUrl || "/cooking_placeholder.png"}
        alt={title}
        className="w-full aspect-video"
        onClick={() => navigate(`/r/${recipeId}`)}
      />
      <div className="p-[15px] space-y-[10px]">
        <div className="flex items-start gap-[10px] justify-between">
          <h3 className="text-lg font-bold flex-1">{title}</h3>
          {/* <button className="w-[30px] h-[30px] flex items-center justify-center bg-page rounded-lg">
            <HugeiconsIcon icon={MoreVerticalIcon} />
          </button> */}
        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[5px]">
            <HugeiconsIcon
              icon={Clock4Icon}
              strokeWidth={2}
              className="text-accent-primary w-18px] md:w-[16px]"
            />
            <p className="opacity-60 text-sm">{time} Minutes</p>
          </div>
          <div className="flex items-center gap-[5px]">
            <HugeiconsIcon
              icon={UserGroupIcon}
              strokeWidth={2}
              className="text-accent-primary w-18px] md:w-[16px]"
            />
            <p className="opacity-60 text-sm">{servings} Servings</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end p-[15px] pt-[0px]">
        <div className="flex items-center gap-[10px]">
          {deleteBtn && (
            <button
              className="cursor-pointer w-[30px] h-[30px] bg-page rounded-md flex items-center
          justify-center border border-border-default text-accent-primary transition-all
          duration-300 ease-in-out hover:bg-subtle"
              onClick={async () => {
                const success = await unsaveRecipe({ id, recipeId });
                if (success && onUnsave) onUnsave();
              }}
            >
              <HugeiconsIcon
                icon={Trash2}
                className="w-[20px] md:w-[18px]"
                strokeWidth={2}
              />
            </button>
          )}
          {/* <button
            className="cursor-pointer w-[30px] h-[30px] bg-page rounded-md flex items-center
          justify-center border border-border-default text-accent-primary transition-all
          duration-300 ease-in-out hover:bg-subtle"
          >
            <HugeiconsIcon
              icon={Share01Icon}
              className="w-[20px] md:w-[18px]"
              strokeWidth={2}
            />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
