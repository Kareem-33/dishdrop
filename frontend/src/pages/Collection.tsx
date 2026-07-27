import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import RecipeCard from "../components/ui/SavedRecipes/RecipeCard";
import useCollectionStore from "../stores/useCollectionStore";
import { useParams } from "react-router-dom";

const Collection = () => {
  const collectionId = useParams().id;
  const { loading, collection, getCollectionData } = useCollectionStore();
  const [showLoading, setShowLoading] = useState(loading);

  useEffect(() => {
    const fetch = async () => {
      await getCollectionData(collectionId!);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    setShowLoading(true);
  }, [loading]);
  if (showLoading) {
    return (
      <div className="py-[160px]">
        <div className="mx-auto animate-[spin_1s_linear_infinite] w-[50px] aspect-square rounded-full border-4 border-t-transparent border-accent-primary" />
      </div>
    );
  }

  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] md:px-[122px] space-y-[35px] border-b border-border-default">
        <div className="space-y-[10px]">
          <h1 className="text-4xl font-black font-heading">
            {collection?.name}
          </h1>
          <p className="opacity-60">{collection?.description}</p>
          <p className="flex items-center h-[41px] gap-[5px] p-[10px] bg-card rounded-lg border border-accent-primary w-fit">
            <HugeiconsIcon
              icon={Bookmark02Icon}
              size={18}
              strokeWidth={2}
              className="text-accent-primary"
            />
            {collection?.recipesCount} Saved recipes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {collection?.recipes?.map((recipe: any) => (
            <RecipeCard
              key={recipe.recipeId._id}
              id={recipe.recipeId._id}
              recipeId={recipe.recipeId._id}
              platform={recipe!.recipeId.source!.platform}
              imageUrl={recipe!.recipeId.source!.thumbnail!}
              title={recipe.recipeId.title}
              time={recipe!.recipeId.estimatedTime + " min"}
              servings={recipe.recipeId.servings + " servings"}
              addDate={recipe.recipeId.createdAt}
              deleteBtn={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
