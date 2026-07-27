import React from "react";

interface RadioInputProps {
  label: string;
  className?: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioInput = ({
  label,
  className = "",
  name,
  value,
  checked,
  onChange,
}: RadioInputProps) => {
  return (
    <label className={`flex items-center gap-[10px] ${className} cursor-pointer`}>
      <input
        type="radio"
        hidden
        name={name}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <div
        className={`w-[20px] h-[20px] rounded-full border ${checked ? "border-accent-primary" : "border-black/60"} flex items-center justify-center transition-all duration-300 ease-in-out`}
      >
        <div
          className={`${checked ? "w-[10px] h-[10px]" : "w-0 h-0"} rounded-full transition-all duration-300 ease-in-out bg-accent-primary`}
        />
      </div>
      <p>{label}</p>
    </label>
  );
};

export default RadioInput;
