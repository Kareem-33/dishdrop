import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import React from "react";

interface EditCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: IconSvgElement;
  count?: string;
}

const EditCard = ({ title, children, className = "", icon, count }: EditCardProps) => {
  return (
    <div
      className={`bg-card border border-border-default rounded-xl ${className}`}
    >
      <div className="p-[20px] border-b border-border-default  flex items-center gap-[10px] justify-between">
        <div className="flex items-center gap-[10px]">
          {icon && (
            <div
              className="bg-accent-primary/10 border border-border-default rounded-md w-[40px] h-[40px] flex
          items-center justify-center text-accent-primary"
            >
              <HugeiconsIcon icon={icon} strokeWidth={2} size={26} />
            </div>
          )}
          <h3 className="text-lg font-bold flex-1">{title}</h3>
        </div>
        {count &&
          <p className="text-sm opacity-60">{count}</p>
        }
      </div>
      <div className="p-[20px] space-y-[40px]">{children}</div>
    </div>
  );
};

export default EditCard;
