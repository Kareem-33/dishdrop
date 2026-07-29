import { useState } from "react";
import Input from "../Input";
import Textarea from "../Textarea";
import { motion } from "framer-motion";
import Button from "../Button";
import { X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useCollectionStore from "../../../stores/useCollectionStore";

const icons = [
  "file_folder",
  "heart",
  "fried_egg",
  "sandwich",
  "knife_fork_plate",
  "cake",
  "cup_with_straw",
  "popcorn",
  "spaghetti",
  "pizza",
  "hamburger",
  "fish",
  "poultry_leg",
  "seedling",
  "green_salad",
  "hot_pepper",
  "fire",
  "ramen",
  "baguette_bread",
  "coffee",
  "crescent_moon",
  "package",
  "zap",
  "muscle",
  "sushi",
  "wine_glass",
  "money_with_wings",
  "teddy_bear",
];

const colors = [
  "#F05A28",
  "#FF0000",
  "#FACC15",
  "#26D926",
  "#00C986",
  "#0EA5E9",
  "#6366F1",
  "#A855F7",
  "#EC4899",
  "#92400E",
  "#6B7280",
];

const NewCollectionModal = ({
  data,
  setShowModal,
  type="create"
}: {
  data?: any;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type?: "create" | "edit";
}) => {
  const [selectedIcon, setSelectedIcon] = useState(data?.icon || icons[0]);
  const [selectedColor, setSelectedColor] = useState(data?.color || colors[0]);
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");

  const { error, createCollection, updateCollection, getCollectionData } = useCollectionStore();

  const handleCreateCollection = async () => {
    await createCollection({
      name,
      description,
      icon: selectedIcon,
      color: selectedColor,
    });
    if (!error) {
      // setShowModal(false);
    }
  };

  const handleEditCollection = async () => {
    await updateCollection({
      _id: data._id,
      name,
      description,
      icon: selectedIcon,
      color: selectedColor,
    });
    if (!error) {
      setShowModal(false);
    }
    getCollectionData(data._id);
  }

  return (
    <div>
      <div
        onClick={() => setShowModal(false)}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-999"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.05, 1] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        exit={{ scale: 0 }}
        className="bg-card w-[90%] md:w-[400px] rounded-[15px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 max-h-[calc(100vh-125px)] overflow-y-auto"
      >
        <HugeiconsIcon
          icon={X}
          size={22}
          strokeWidth={2}
          className="absolute top-[10px] right-[10px] cursor-pointer opacity-40"
          onClick={() => setShowModal(false)}
        />
        <div className="p-[20px] border-b border-border-default">
          <h3 className="text-lg font-bold">Create new collection</h3>
          <p className="opacity-60 text-sm">
            Organize your recipes into a custom folder
          </p>
        </div>
        <div className="p-[20px] space-y-[30px]">
          <Input
            placeholder="e.g. Weeknight Dinners"
            label="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Describe your collection..."
            label="Description"
            optional
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col gap-[5px]">
            <p className="text-sm font-bold">Select icon</p>
            <div className="grid grid-cols-7 grid-rows-4 gap-[10px]">
              {icons.map((icon, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center cursor-pointer border w-[40px] h-[40px] rounded-md transition-all duration-300 ease-in-out
                    ${icon === selectedIcon ? "border-accent-primary bg-accent-primary/10" : "border-transparent bg-gray-100"}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  <img
                    src={`/emojis/${icon}.png`}
                    alt="emoji"
                    className="w-[25px] h-[25px]"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="text-sm font-bold">Select color</p>
            <div className="flex gap-[10px]">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border flex-1 aspect-square rounded-full transition-all duration-300 ease-in-out`}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    backgroundColor:
                      color === selectedColor ? color : `${color}20`,
                    borderColor: color,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <Button
              variant="primary"
              className="flex-1"
              onClick={type === "edit" ? handleEditCollection : handleCreateCollection}
            >
              {type === "edit" ? "Update collection" : "Create collection"}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewCollectionModal;
