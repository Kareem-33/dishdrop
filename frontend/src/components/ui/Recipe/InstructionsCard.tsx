import { ChefIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckboxItem from "../CheckboxItem";

interface InstructionsCardProps {
  instructions: string[];
}

const InstructionsCard = ({ instructions }: InstructionsCardProps) => {
  return (
    <div className="bg-card h-fit border-border-default border rounded-lg overflow-hidden shadow">
      <div className="p-[15px] md:p-[30px] flex items-center gap-[10px] bg-page border-b border-border-default">
        <div
          className="bg-accent-primary/10 border border-border-default rounded-md w-[40px] h-[40px] flex
        items-center justify-center text-accent-primary"
        >
          <HugeiconsIcon icon={ChefIcon} strokeWidth={2} size={26} />
        </div>
        <h3 className="font-bold text-2xl">Instructions</h3>
      </div>
      <div className="p-[15px] md:p-[30px] space-y-[20px]">
        <div className="divide-y divide-border-default">
          {instructions.map((instruction, index) => (
            <div className="flex items-center gap-[10px] py-[20px]" key={index}>
              <p className="w-[35px] h-[35px] flex items-center justify-center border border-accent-primary bg-accent-primary/15 rounded-full shrink-0 text-accent-primary font-bold">
                {index + 1}
              </p>
              <CheckboxItem>{instruction}</CheckboxItem>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionsCard;
