import Input from "../Input";
import { Search01FreeIcons } from "@hugeicons/core-free-icons";
import { platforms } from "../VideoUrlInput";
import Tag from "../Tag";
import { useState } from "react";

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
    value: "a-z",
    name: "Name (A-Z)",
  },
  {
    value: "cooking-time",
    name: "Cooking Time",
  },
];

const RecipeSearch = ({
  search,
  setSearch,
  sort,
  setSort,
  setTag,
}: any) => {
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedSort, setSelectedSort] = useState(sort);
  return (
    <div className="bg-card p-[15px] rounded-lg border border-border-default flex flex-col gap-[10px] items-end">
      <Input
        placeholder="Search recipes by name or ingredient..."
        icon={Search01FreeIcons}
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col items-end md:flex-row md:justify-between md:items-center w-full">
        <div className="flex gap-[5px] flex-wrap my-[10px]">
          <Tag
            key={0}
            selected={selectedTag === "all"}
            value="all"
            onClick={() => {
              setSelectedTag("all");
              setTag("all");
            }}
          >
            All
          </Tag>
          {platforms.map((platform, index) => (
            <Tag
              key={index + 1}
              value={platform.name.toLowerCase()}
              selected={selectedTag === platform.name.toLowerCase()}
              onClick={() => {
                setSelectedTag(platform.name.toLowerCase());
                setTag(platform.name.toLowerCase());
              }}
            >
              {platform.name}
            </Tag>
          ))}
        </div>
        <select
          className="cursor-pointer max-w-[150px] px-3 h-[41px] border border-border-default rounded-md transition-all duration-300
          focus:outline-none focus:ring-5 focus:ring-accent-primary/15 bg-page/50"
          defaultValue={selectedSort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((option, index) => (
            <option
              key={index}
              value={option.value}
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

export default RecipeSearch;
