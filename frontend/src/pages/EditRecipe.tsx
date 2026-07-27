import {
  AlertSquareIcon,
  CarrotIcon,
  ChefIcon,
  DragDropVerticalIcon,
  InformationCircleIcon,
  Plus,
  SaveIcon,
  TagsIcon,
  Trash2,
  X,
} from "@hugeicons/core-free-icons";
import EditCard from "../components/ui/EditRecipe/EditCard";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";
import useRecipeStore from "../stores/useRecipeStore";
import { useParams } from "react-router-dom";
import useSavedStore from "../stores/useSavedStore";

const ingredientsConst = [
  {
    quantity: 4,
    unit: "tbsp",
    name: "butter",
  },
  {
    quantity: 6,
    unit: "cloves",
    name: "garlic, minced",
  },
  {
    quantity: 2,
    unit: "cups",
    name: "heavy cream",
  },
  {
    quantity: 1,
    unit: "tsp",
    name: "salt",
  },
];

const instructionsConst = [
  "Bring a large pot of salted water to a boil. Add the pasta and cook according to package directions until al dente. Reserve 1 cup of pasta water before draining.",
  "While the pasta cooks, melt the butter in a large skillet over medium heat. Add the minced garlic and sauté for 1-2 minutes until fragrant but not browned.",
  "Pour in the heavy cream and bring to a gentle simmer. Let it cook for 3-4 minutes, stirring occasionally, until the sauce starts to thicken slightly.",
  "Reduce heat to low and gradually whisk in the parmesan cheese, stirring constantly until the cheese is fully melted and the sauce is smooth and creamy.",
];

const tagsConst = ["Dinner", "Quick Meals", "Pasta", "Italian"];

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const EditRecipe = () => {
  const { id: recipeId } = useParams();
  const { recipe, getRecipe } = useRecipeStore();
  if (!recipe || !recipeId) return <div>Loading...</div>;
  const { updateSavedRecipe } = useSavedStore();
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [servings, setServings] = useState(recipe.servings);
  const [estimatedTime, setEstimatedTime] = useState(recipe.estimatedTime);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.steps);
  const [tags, setTags] = useState(recipe.tags);
  const [newTag, setNewTag] = useState("");

  const onDragEndIng = (result: any) => {
    if (!result.destination) return;

    const items = reorder(
      ingredients,
      result.source.index,
      result.destination.index,
    );

    setIngredients(items as any);
  };

  const onDragEndIns = (result: any) => {
    if (!result.destination) return;

    const items = reorder(
      instructions,
      result.source.index,
      result.destination.index,
    );

    setInstructions(items as any);
  };

  const editInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    value: keyof (typeof ingredients)[0],
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index
          ? {
              ...ing,
              [value]:
                value === "amount"
                  ? Number.isNaN(Number(e.target.value))
                    ? ing[value]
                    : Number(e.target.value)
                  : e.target.value,
            }
          : ing,
      ),
    );
  };

  const editTextarea = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
  ) => {
    setInstructions((prev) =>
      prev.map((ins, i) => (i === index ? (ins = e.target.value) : ins)),
    );
  };

  useEffect(() => {
    console.log("recipeId: ", recipeId);
    console.log("recipe: ", recipe);
  }, []);

  const handleSave = async () => {
    await updateSavedRecipe({
      recipeId: recipeId,
      updateData: {
        title,
        description,
        servings,
        estimatedTime,
        ingredients,
        steps: instructions,
        tags,
      },
    });

    window.location.href = `/r/${recipeId}`;
  };

  return (
    <div className="pt-[80px]">
      <div className="py-[40px] md:px-[465px] px-[20px] space-y-[35px]">
        <div className="space-y-[10px]">
          <h1 className="text-4xl font-black font-heading">Edit Recipe</h1>
          <p className="opacity-60">
            Make changes to fix AI errors or customize this recipe
          </p>
        </div>
        <EditCard title="Basic Information" icon={AlertSquareIcon}>
          <Input
            label="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-[20px]">
            <Input
              label="Servings"
              type="number"
              className="flex-1"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
            <Input
              label="Time (minutes)"
              type="number"
              className="flex-1"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
            />
          </div>
        </EditCard>
        <EditCard
          title="Ingredients"
          icon={CarrotIcon}
          count={`${ingredients.length} ingredients`}
        >
          <p className="md:hidden text-xs opacity-60 font-semibold flex items-center gap-[5px]">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              strokeWidth={2}
            />
            Hold the ingredient and swap to change orders.
          </p>
          <div>
            <DragDropContext onDragEnd={onDragEndIng}>
              <Droppable droppableId="list">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className=""
                  >
                    {ingredients.map((ingredient, index) => (
                      <Draggable
                        key={index}
                        draggableId={`${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="select-none mb-[15px] bg-page border border-border-default rounded-[7px] p-[15px] flex items-center gap-[10px] justify-between"
                          >
                            <HugeiconsIcon
                              icon={DragDropVerticalIcon}
                              size={18}
                              className="opacity-60 shrink-0"
                            />
                            <div className="flex flex-col gap-[5px]">
                              <div className="flex items-center gap-[5px]">
                                <Input
                                  value={ingredient.amount}
                                  inputBg="bg-white"
                                  placeholder="1"
                                  onChange={(e) =>
                                    editInput(e, index, "amount")
                                  }
                                />
                                <Input
                                  value={ingredient.unit}
                                  inputBg="bg-white"
                                  placeholder="unit"
                                  onChange={(e) => editInput(e, index, "unit")}
                                />
                              </div>
                              <Input
                                value={ingredient.name}
                                inputBg="bg-white"
                                placeholder="ingredient"
                                onChange={(e) => editInput(e, index, "name")}
                              />
                            </div>
                            <HugeiconsIcon
                              icon={Trash2}
                              size={18}
                              className="shrink-0 text-accent-primary"
                              strokeWidth={2}
                              onClick={() =>
                                setIngredients((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              onClick={() => {
                const hasEmptyIngredient = ingredients.some(
                  (ingredient) =>
                    ingredient.amount === "0" &&
                    ingredient.unit === "" &&
                    ingredient.name === "",
                );

                if (hasEmptyIngredient) return;
                setIngredients((prev) => [
                  ...prev,
                  { amount: "0", unit: "", name: "" },
                ]);
              }}
              className="bg-transparent border-dashed border-2! text-accent-primary! w-full"
            >
              <HugeiconsIcon icon={Plus} />
              Add ingredient
            </Button>
          </div>
        </EditCard>
        <EditCard
          title="Instructions"
          icon={ChefIcon}
          count={`${instructions.length} steps`}
        >
          <p className="md:hidden text-xs opacity-60 font-semibold flex items-center gap-[5px]">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              strokeWidth={2}
            />
            Hold the instruction and swap to change orders.
          </p>
          <div>
            <DragDropContext onDragEnd={onDragEndIns}>
              <Droppable droppableId="list">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {instructions.map((instruction, index) => (
                      <Draggable
                        key={index}
                        draggableId={`${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="select-none mb-[15px] bg-page border border-border-default rounded-[7px] p-[15px] flex flex-col items-center gap-[10px]"
                          >
                            <p className="w-[35px] h-[35px] flex items-center justify-center border border-accent-primary bg-accent-primary/15 rounded-full shrink-0 text-accent-primary font-bold">
                              {index + 1}
                            </p>
                            <div className="flex gap-[10px] justify-between items-center w-full">
                              <HugeiconsIcon
                                icon={DragDropVerticalIcon}
                                size={18}
                                className="opacity-60 shrink-0"
                              />
                              <Textarea
                                value={instruction}
                                inputBg="bg-white"
                                placeholder="Enter new instruction..."
                                onChange={(e) => editTextarea(e, index)}
                                className="flex-1"
                              />
                              <HugeiconsIcon
                                icon={Trash2}
                                size={18}
                                className="shrink-0 text-accent-primary"
                                strokeWidth={2}
                                onClick={() =>
                                  setInstructions((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              onClick={() => {
                const hasEmptyInstruction = instructions.some(
                  (instruction) => instruction === "",
                );

                if (hasEmptyInstruction) return;
                setInstructions((prev) => [...prev, ""]);
              }}
              className="bg-transparent border-dashed border-2! text-accent-primary! w-full"
            >
              <HugeiconsIcon icon={Plus} />
              Add instruction
            </Button>
          </div>
        </EditCard>
        <EditCard title="Tags" icon={TagsIcon} count={`${tags.length} tags`}>
          <div className="space-y-[10px]">
            <p>Recipe tags</p>
            <div className="flex items-center gap-[5px] flex-wrap">
              {tags.map((tag, index) => (
                <Tag className="gap-[7px]">
                  {tag}
                  <HugeiconsIcon
                    icon={X}
                    size={14}
                    strokeWidth={3}
                    onClick={() =>
                      setTags((prev) => prev.filter((_, i) => i !== index))
                    }
                  />
                </Tag>
              ))}
            </div>
            <div className="flex items-end w-full">
              <Input
                type="text"
                placeholder="Enter new tag..."
                onChange={(e) => setNewTag(e.target.value)}
                value={newTag}
                className="flex-1"
                inputClassName="rounded-r-none"
              />
              <Button
                className="h-[41px] w-[41px] p-0! rounded-l-none"
                onClick={() => {
                  if (newTag === "") return;
                  setTags((prev) => [...prev, newTag]);
                  setNewTag("");
                }}
              >
                <HugeiconsIcon icon={Plus} />
              </Button>
            </div>
          </div>
        </EditCard>
        <div className="flex gap-[10px]">
          <Button className="flex-1" onClick={handleSave}>
            <HugeiconsIcon icon={SaveIcon} size={18} strokeWidth={2} />
            Save
          </Button>
          <Button variant="secondary">
            <HugeiconsIcon icon={X} size={18} strokeWidth={2} />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
