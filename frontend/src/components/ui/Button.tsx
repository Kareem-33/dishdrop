import React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  variant = "primary",
  size = "md",
  onClick = () => {},
  children,
  className,
  loading = false,
  disabled = false,
  type = "button",
}: ButtonProps) => {
  const variants = {
    primary: "bg-accent-primary border-[1.5px] border-accent-primary text-dark-text hover:bg-accent-hover",
    secondary: "border-[1.5px] bg-accent-primary/10 border-accent-primary text-accent-primary hover:bg-accent-hover/25",
    ghost: "border-[1px] border-accent-primary hover:bg-accent-hover hover:bg-gray-200",
  };

  const sizes = {
    sm: "px-[16px] py-[7px] text-[13px] rounded-sm gap-[6px]",
    md: "px-[20px] py-[10px] text-[14px] rounded-md gap-[7px]",
    lg: "px-[26px] py-[13px] text-[15px] rounded-lg gap-[8px]"
  };

  return (
    <button
      className={`
        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold cursor-pointer
        focus:outline-none focus:ring-5 focus:ring-accent-primary/15 flex items-center justify-center gap-[5px]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
