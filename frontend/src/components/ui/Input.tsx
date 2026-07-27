import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import React, { useRef, useState } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  label?: string;
  optional?: boolean;
  required?: boolean;
  icon?: IconSvgElement;
  inputBg?: string
}

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  label,
  optional = false,
  required = false,
  icon,
  inputBg,
  inputClassName
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className={`flex flex-col gap-[5px] ${className}`}>
      <span className="text-sm font-bold">
        {label}{" "}
        {optional && <span className="opacity-60 font-normal">(optional)</span>}
        {required && <span className="text-red-500 font-normal">*</span>}
      </span>
      <div className={`relative`}>
        <input
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-3 h-[41px] border border-border-default rounded-md transition-all duration-300
          focus:outline-none focus:ring-5 focus:ring-accent-primary/15
          ${inputBg ? inputBg : "bg-page/50"}
          ${icon && "pl-[40px]"}
          ${type === "password" && "pr-[40px]"}
          ${inputClassName}`}
          required={required}
          ref={inputRef}
        />
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={20}
            className={`opacity-50 absolute left-3 top-1/2 -translate-y-1/2`}
            strokeWidth={2}
          />
        )}
        {type === "password" && (
          <HugeiconsIcon
            icon={showPassword ? ViewOffSlashIcon : ViewIcon}
            size={20}
            className={`opacity-50 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
            strokeWidth={2}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </label>
  );
};

export default Input;
