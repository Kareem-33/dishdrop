import { useState } from "react";
import Input from "../Input";
import { Folder02Icon, Search01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const sortOptions = [
  {
    value: "recent",
    name: "Most recent",
  },
  {
    value: "oldest",
    name: "Oldest first",
  },
  {
    value: "name",
    name: "Name (A-Z)",
  },
  {
    value: "cookingTime",
    name: "Cooking Time",
  },
];

const CollectionSearch = () => {
  const [selectedSort, setSelectedSort] = useState("recent");

  return (
    <div className="bg-card p-[15px] rounded-lg border border-border-default flex flex-col gap-[10px]">
      <Input
        placeholder="Search collections by name..."
        icon={Search01FreeIcons}
        className="w-full"
      />
      <div className="flex items-center w-full justify-between gap-[10px]">
        <p className="flex items-center h-[41px] gap-[5px] p-[10px] bg-card rounded-lg border border-accent-primary w-fit">
          <HugeiconsIcon
            icon={Folder02Icon}
            size={18}
            strokeWidth={2}
            className="text-accent-primary"
          />
          24 Collections
        </p>
        <select
          className=" cursor-pointer max-w-[150px] px-3 h-[41px] border border-border-default
          rounded-md transition-all duration-300 focus:outline-none focus:ring-5
          focus:ring-accent-primary/15 bg-page/50"
        >
          {sortOptions.map((option, index) => (
            <option
              key={index}
              value={option.value}
              selected={selectedSort === option.value}
              onClick={() => setSelectedSort(option.value)}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CollectionSearch;
