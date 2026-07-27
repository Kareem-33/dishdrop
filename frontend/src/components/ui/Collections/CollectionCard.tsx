import {
  Dish01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";

interface CollectionCardProps {
  id: string;
  icon: string;
  name: string;
  updateDate: Date;
  recipesCount: number;
  description: string;
  color: string;
}

const CollectionCard = ({
  id,
  icon,
  name,
  recipesCount = 0,
  description,
  color,
}: CollectionCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-xl border border-border-default overflow-hidden relative
      hover:shadow-lg shadow-accent-primary/15 hover:border-accent-primary cursor-pointer
      transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
      id={id}
      onClick={() => navigate(`/c/${id}`)}
    >
      <div
        className={`w-full h-[75px] text-4xl flex items-center justify-center`}
        style={{ backgroundColor: `${color}20` }}
      >
        <img src={`/emojis/${icon}.png`} alt="collection icon" className="w-[46px]" />
        {/* <span className="text-shadow-lg text-shadow-black/10">{icon}</span> */}
      </div>
      <div className="p-[20px]">
        <h3 className="text-lg font-bold flex items-center w-full justify-between">
          {name}
          {/* <button className="w-[30px] h-[30px] bg-page flex items-center justify-center rounded">
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              size={22}
              className="opacity-50"
            />
          </button> */}
        </h3>
        <p className="opacity-60 text-sm">{description}</p>
        <div className="flex items-center gap-[5px] mt-[10px] px-[15px] py-[5px] bg-page rounded-full w-fit">
          <HugeiconsIcon
            icon={Dish01Icon}
            size={18}
            strokeWidth={2}
            className="text-accent-primary"
          />
          <p className="opacity-60 text-sm">{recipesCount} recipes</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
