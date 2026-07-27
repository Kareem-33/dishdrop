import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface RecipeWidgetProps {
  icon: IconSvgElement;
  title: string;
  value: string;
}

const RecipeWidget = ({
  icon,
  title,
  value
}: RecipeWidgetProps) => {
  return (
    <div className="bg-white border border-accent-primary/30 rounded-xl w-fit p-[10px] space-y-[5px] min-w-[100px]">
      <div className="w-[40px] h-[40px] flex items-center rounded-lg justify-center bg-page text-accent-primary">
        <HugeiconsIcon icon={icon} strokeWidth={2} size={24} />
      </div>
      <p className="opacity-60">{title}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
};

export default RecipeWidget;
