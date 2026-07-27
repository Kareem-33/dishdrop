import { CheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type ReactNode } from "react";

interface CheckboxItemProps {
  children: ReactNode;
  value?: any;
  className?: string;
  size?: "md" | "sm";
  line?: boolean;
}

const CheckboxItem = ({
  children,
  value,
  className,
  size = "md",
  line = true,
}: CheckboxItemProps) => {
  const [checked, setChecked] = useState(false);

  const sizes = {
    md: "w-[25px] h-[25px] rounded-lg",
    sm: "w-[20px] h-[20px] rounded-md",
  };

  return (
    <label className={`flex items-center gap-[10px] ${className}`}>
      <input
        type="checkbox"
        hidden
        onChange={(e) =>
          e.target.checked ? setChecked(true) : setChecked(false)
        }
        value={value}
      />
      <div
        className={`flex items-center justify-center border-[1.5px] border-border-default
        transition-all duration-300 ease-in-out shrink-0
        ${checked && "bg-accent-primary"}
        ${sizes[size]}`
      }
      >
        <HugeiconsIcon
          icon={CheckIcon}
          size={size === "md" ? 18 : 16}
          strokeWidth={3}
          className={`${checked ? "block" : "hidden"} text-dark-text transition-all duration-300 ease-in-out`}
        />
      </div>
      <p
        className={`${checked && line && "opacity-40 relative line-through"} transition-all duration-300 ease-in-out`}
      >
        {children}
      </p>
    </label>
  );
};

export default CheckboxItem;
