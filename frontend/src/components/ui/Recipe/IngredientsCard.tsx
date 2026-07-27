import {
  CarrotIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckboxItem from "../CheckboxItem";
import type { IIngredient } from "../../../stores/useRecipeStore";

interface IngredientsCardProps {
  ingredients: IIngredient[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {

  return (
    <div className="bg-card h-fit border-border-default border rounded-lg overflow-hidden shadow">
      <div className="p-[15px] md:p-[30px] flex items-center gap-[10px] bg-page border-b border-border-default">
        <div
          className="bg-accent-primary/10 border border-border-default rounded-md w-[40px] h-[40px] flex
        items-center justify-center text-accent-primary"
        >
          <HugeiconsIcon icon={CarrotIcon} strokeWidth={2} size={26} />
        </div>
        <h3 className="font-bold text-2xl">Ingredients</h3>
      </div>
      <div className="p-[15px] md:p-[30px] space-y-[20px]">
        {/* <div className="flex items-center justify-between bg-page border border-border-default p-[10px] rounded-md">
          <p>Servings</p>
          <div className="flex items-center gap-[5px] ">
            <HugeiconsIcon
              size={30}
              icon={MinusSignSquareIcon}
              className={`text-accent-primary fill-card disabled:opacity-25 ${servings == 1 && "opacity-35"}`}
              onClick={() =>
                setServings(servings > 1 ? servings - 1 : servings)
              }
            />
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value as any)}
              className="border-b-2 border-border-default w-[50px]! p-0! font-bold text-center"
            />
            <HugeiconsIcon
              size={30}
              icon={PlusSignSquareIcon}
              className="text-accent-primary fill-card disabled:opacity-25"
              onClick={() => setServings(servings + 1)}
            />
          </div>
        </div> */}
        {ingredients.length > 0 && (
          <div className="divide-y divide-border-default">
            {ingredients.map((ingredient, index) => (
              <CheckboxItem key={index} className="py-[20px]">
                <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
              </CheckboxItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsCard;
