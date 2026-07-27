import { type ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  value?: string;
  className?: string;
}

const Tag = ({
  children,
  selected = false,
  onClick,
  value,
  className,
}: TagProps) => {
  return (
    <button
      className={`cursor-pointer flex items-center gap-10px px-[12px] py-[6px] rounded-full font-bold text-sm  w-fit transition-all duration-300 ease-in-out
      lowercase ${selected ? "bg-accent-primary text-dark-text" : "bg-accent-primary/20 text-accent-primary"} ${className}`}
      onClick={onClick}
      data-value={value}
    >
      {children}
    </button>
  );
};

export default Tag;
