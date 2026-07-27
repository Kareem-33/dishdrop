import { BadgeIcon, Check } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const EmailVerified = () => {
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px]">
        <div className="md:w-[600px] mx-auto p-[25px] text-center rounded-lg border border-border-default bg-card flex flex-col items-center gap-[30px]">
          <div className="relative w-[100px] aspect-square text-success">
            <HugeiconsIcon icon={BadgeIcon} strokeWidth={1.5} size={100} className=" fill-success/25 animate-[spin_15s_linear_infinite]" />
            <HugeiconsIcon
              icon={Check}
              strokeWidth={2}
              size={60}
              className="absolute -translate-1/2 left-1/2 top-1/2"
            />
          </div>
          <div className="space-y-[10px]">
            <h2 className="font-heading text-2xl md:text-4xl">Email verified</h2>
            <p className="text-sm opacity-60">
              Your email has been verified. You can now log in to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
