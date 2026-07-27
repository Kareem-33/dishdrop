import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";

interface cardProps {
  icon: IconSvgElement;
  title: string;
  count: number;
  children: ReactNode;
}

const FeaturesCard = ({ icon, title, count, children }: cardProps) => {
  return (
    <div className="border border-border-default p-[30px] hover:bg-accent-primary/4 transition-all duration-300 ease-in-out cursor-default">
      <div className="flex items-center justify-between opacity-25 mb-[30px] font-extrabold text-sm">
        {count < 10 ? "0" + count : count}
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="w-[40px] h-[40px] flex items-center justify-center bg-page text-accent-primary">
          <HugeiconsIcon icon={icon} strokeWidth={2} size={24} />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm opacity-60">{children}</p>
      </div>
    </div>
  );
};

export default FeaturesCard;
