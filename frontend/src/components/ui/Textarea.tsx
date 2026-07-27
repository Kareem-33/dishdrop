import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import React, { useRef } from "react";

interface TextareaProps {
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  optional?: boolean;
  required?: boolean;
  icon?: IconSvgElement;
  inputBg?: string;
}

const Textarea = ({
  placeholder,
  value,
  onChange,
  className,
  label,
  optional = false,
  required = false,
  icon,
  inputBg
}: TextareaProps) => {
  const TextareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <label className={`flex flex-col gap-[5px] ${className}`}>
      <span className="text-sm font-bold">
        {label}{" "}
        {optional && <span className="opacity-60 font-normal">(optional)</span>}
        {required && <span className="text-red-500 font-normal">*</span>}
      </span>
      <div className={`relative`}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full min-h-20 h-35 px-3 py-2  border border-border-default rounded-md
          transition-shadow duration-300 focus:outline-none focus:ring-5 focus:ring-accent-primary/15
          ${icon && "pl-[40px]"}
          ${inputBg ? inputBg : "bg-page/50"}`}
          required={required}
          ref={TextareaRef}
        />
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={20}
            className={`opacity-50 absolute left-3 top-1/2 -translate-y-1/2`}
            strokeWidth={2}
          />
        )}
      </div>
    </label>
  );
};

export default Textarea;
