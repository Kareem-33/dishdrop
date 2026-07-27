import React from "react";

interface SettingCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const SettingCard = ({
  title,
  description,
  children,
  className = "",
}: SettingCardProps) => {
  return (
    <div
      className={`bg-card border border-border-default rounded-xl ${className}`}
    >
      <div className="p-[20px] border-b border-border-default">
        <h3 className="text-lg font-bold flex-1">{title}</h3>
        <p className="text-sm opacity-60">{description}</p>
      </div>
      <div className="p-[20px] space-y-[40px]">{children}</div>
    </div>
  );
};

export default SettingCard;
