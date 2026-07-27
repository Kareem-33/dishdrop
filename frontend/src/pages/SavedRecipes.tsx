import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import RecipeSearch from "../components/ui/SavedRecipes/RecipeSearch";
import RecipeCard from "../components/ui/SavedRecipes/RecipeCard";
import Paging from "../components/ui/Paging";
import useSavedStore from "../stores/useSavedStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SavedRecipes = () => {
  const {
    recipes,
    count,
    pages,
    totalSaved,
    fetchSavedRecipes,
    savedRecipesCount,
  } = useSavedStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "recent");
  const [tag, setTag] = useState(searchParams.get("platform") || "all");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(Number(searchParams.get("limit")) || 9);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sort", sort);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (tag && tag !== "all") {
        params.set("platform", tag);
      }

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, sort, tag, page, limit, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, limit, tag]);

  useEffect(() => {
    fetchSavedRecipes({
      page,
      limit,
      search,
      sort,
      platform: tag === "all" ? "" : tag,
    });
  }, [page, limit, search, sort, tag]);

  useEffect(() => {
    savedRecipesCount();
  }, []);
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] md:px-[122px] space-y-[35px] border-b border-border-default">
        <div className="space-y-[10px]">
          <h1 className="text-4xl font-black font-heading">My Recipes</h1>
          <p className="opacity-60">All your saved recipes in one place</p>
          <p className="flex items-center h-[41px] gap-[5px] p-[10px] bg-card rounded-lg border border-accent-primary w-fit">
            <HugeiconsIcon
              icon={Bookmark02Icon}
              size={18}
              strokeWidth={2}
              className="text-accent-primary"
            />
            {totalSaved} Saved recipes
          </p>
        </div>
        <RecipeSearch
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setSearch={setSearch}
          search={search}
          sort={sort}
          setSort={setSort}
          tag={tag}
          setTag={setTag}
        />
      </div>
      <div className="px-[20px] py-[40px] md:px-[122px] space-y-[30px]">
        <p>
          Showing {page * limit - limit ? page * limit - limit + 1 : 0} -{" "}
          {page * limit > count ? count : page * limit} of {count} recipes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {recipes?.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              id={recipe._id}
              recipeId={recipe.recipeId}
              platform={recipe.recipe.source.platform}
              imageUrl={recipe.recipe.source.thumbnail}
              title={recipe.recipe.title}
              time={recipe.recipe.estimatedTime}
              servings={recipe.recipe.servings}
              addDate={recipe.createdAt}
              onUnsave={() =>
                fetchSavedRecipes({
                  page: parseInt(searchParams.get("page") as string) || 1,
                  limit: parseInt(searchParams.get("limit") as string) || 9,
                  search: searchParams.get("search") || "",
                  sort: searchParams.get("sort") || "recent",
                  platform: searchParams.get("platform") || "",
                })
              }
            />
          ))}
        </div>
      </div>
      <div className="px-[20px] pb-[40px]">
        <Paging page={page} totalPages={pages} setPage={setPage} />
      </div>
    </div>
  );
};

export default SavedRecipes;
