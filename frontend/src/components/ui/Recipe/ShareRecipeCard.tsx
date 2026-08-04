import {
  Copy01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../Button";
import toast from "react-hot-toast";

const ShareRecipeCard = () => {
  return (
    <div className="p-[15px] space-y-[10px] bg-card border-border-default border rounded-lg overflow-hidden shadow">
      <div className="flex items-center gap-[10px]">
        <div className="w-[40px] h-[40px] flex items-center rounded-lg justify-center bg-page text-accent-primary">
          <HugeiconsIcon icon={Share01Icon} strokeWidth={2} size={24} />
        </div>
        <h3 className="text-lg font-bold">Share this recipe</h3>
      </div>
      <p className="text-sm opacity-60">
        Anyone with this link can view and save this recipe to their profile.
      </p>
      <div className="flex items-center gap-0 w-full">
        <div
          className={`overflow-hidden px-3 h-[41px] border border-border-default rounded-md transition-all duration-300
          focus:outline-none focus:ring-5 focus:ring-accent-primary/15 bg-page/50 rounded-r-none flex
          items-center`}
        >
          <span className="truncate">

          {window.location.href}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          className="h-[41px] flex-shrink-0 rounded-l-none px-[10px]! shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Copied to clipboard");
          }}
        >
          <HugeiconsIcon
            icon={Copy01Icon}
            className="text-dark-text"
            size={22}
            strokeWidth={2}
          />
        </Button>
      </div>
    </div>
  );
};

export default ShareRecipeCard;
