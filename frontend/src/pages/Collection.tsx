import {
  Bookmark02Icon,
  PencilEdit02Icon,
  Plus,
  Trash2,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import RecipeCard from "../components/ui/SavedRecipes/RecipeCard";
import useCollectionStore from "../stores/useCollectionStore";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import NewCollectionModal from "../components/ui/Collections/NewCollectionModal";

const Collection = () => {
  const collectionId = useParams().id;
  const { loading, collection, getCollectionData, deleteCollection } =
    useCollectionStore();
  const [showLoading, setShowLoading] = useState(loading);
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);

  const navigate = useNavigate();

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

  document.title = `${collection?.name} | DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From`;
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] md:px-[122px] space-y-[35px] border-b border-border-default">
        <div className="space-y-[10px]">
          <h1 className="text-4xl font-black font-heading flex items-center gap-[10px] mb-[20px]">
            <div
              className="w-[40px] aspect-square border-2 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: `${collection?.color}10`,
                borderColor: `${collection?.color}50`,
              }}
            >
              <img
                src={`/emojis/${collection?.icon}.png`}
                alt="collection icon"
                className="w-[25px]"
              />
            </div>
            <span>{collection?.name}</span>
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
          <div className="flex gap-[10px] flex-wrap w-full">
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewRecipeModal(true);
              }}
            >
              <HugeiconsIcon
                icon={PencilEdit02Icon}
                size={22}
                strokeWidth={2}
              />
              Edit collection
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                deleteCollection(collectionId!);
                navigate("/c");
              }}
            >
              <HugeiconsIcon icon={Trash2} size={22} strokeWidth={2} />
              Delete collection
            </Button>
          </div>
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
      {showNewRecipeModal && (
        <NewCollectionModal
          setShowModal={setShowNewRecipeModal}
          data={collection}
          type="edit"
        />
      )}
    </div>
  );
};

export default Collection;
