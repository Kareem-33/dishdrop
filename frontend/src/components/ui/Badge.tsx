import React from "react";

const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex items-center gap-[6px] bg-card border border-border-default
    px-[12px] py-[6px] rounded-full w-fit text-accent-primary uppercase text-sm font-medium"
    >
      {children}
    </div>
  );
};

export default Badge;
