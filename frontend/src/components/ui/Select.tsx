import { ChevronDown } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";

interface SelectProps {
  className?: string;
  options: {
    value: string;
    name: string;
    selected: boolean;
    hidden?: boolean;
  }[];
  selectedSort: {
    value: string;
    name: string;
    selected: boolean;
    hidden?: boolean;
  },
  setSelectedSort: React.Dispatch<React.SetStateAction<{ value: string; name: string; selected?: boolean; hidden?: boolean; }>>
}

const Select = ({ className, options }: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.selected),
  );
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      className={`w-[150px] px-3 h-[41px] border border-border-default rounded-md transition-all duration-300 relative
      focus:outline-none focus:ring-5 focus:ring-accent-primary/15 bg-page/50 flex items-center gap-[10px]
      ${className}`}
      onClick={() => setOpenMenu(!openMenu)}
    >
      <p className="text-nowrap max-w-full truncate flex-1">{selectedOption?.name}</p>
      <HugeiconsIcon icon={ChevronDown} size={22} className={`${openMenu && 'rotate-180'} transition-all duration-300 ease-in-out`}/>
      {openMenu &&
        <div className="absolute min-w-[250px] top-full left-0 bg-card shadow-lg rounded-lg border-border-default border">
          {options.map((option, index) => (
            <p className="p-3 border-b border-border-default" onClick={() => setSelectedOption(option)}>{option.name}</p>
          ))}
        </div>
      }
    </div>
  );
};

export default Select;
