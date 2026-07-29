import { useCallback, useEffect, useState } from "react";
import { platforms } from "../components/ui/VideoUrlInput";
import SocialMediaBadge from "../components/ui/SocialMediaBadge";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  Bookmark02Icon,
  CheckIcon,
  Clock4Icon,
  CopyPlusIcon,
  ExternalLinkIcon,
  Fire02Icon,
  Money03Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  PuzzleIcon,
  Share01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Tag from "../components/ui/Tag";
import RecipeWidget from "../components/ui/Recipe/RecipeWidget";
import Button from "../components/ui/Button";
import IngredientsCard from "../components/ui/Recipe/IngredientsCard";
import InstructionsCard from "../components/ui/Recipe/InstructionsCard";
import StartBanner from "../components/ui/StartBanner";
import ShareRecipeCard from "../components/ui/Recipe/ShareRecipeCard";
import useRecipeStore from "../stores/useRecipeStore";
import useSavedStore from "../stores/useSavedStore";
import toast from "react-hot-toast";
import useCollectionStore from "../stores/useCollectionStore";

const Recipe = () => {
  const navigate = useNavigate();
  const { id: recipeId } = useParams<{ id: string }>();
  const { recipe, getRecipe, saveRecipe } = useRecipeStore();
  const { recipes, fetchSavedRecipes, unsaveRecipe } = useSavedStore();
  const {
    collections,
    getCollections,
    addRecipeToCollection,
    removeRecipeFromCollection,
  } = useCollectionStore();

  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingCollectionId, setAddingCollectionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!recipeId) return;
    getRecipe(recipeId);
  }, [recipeId, getRecipe]);

  useEffect(() => {
    fetchSavedRecipes({});
    getCollections();
  }, [
    fetchSavedRecipes,
    getCollections,
    removeRecipeFromCollection,
    addRecipeToCollection,
  ]);

  useEffect(() => {
    setSaved(recipes.some((r) => r.recipeId === recipeId));
  }, [recipes, recipeId]);

  // Close on Escape + always restore body scroll, even on unmount
  useEffect(() => {
    if (!openCollectionModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCollectionModal(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openCollectionModal]);

  const handleSaveToggle = useCallback(async () => {
    if (!recipe) return;
    try {
      if (saved) {
        await unsaveRecipe({ recipeId: recipe._id });
        setSaved(false);
        getCollections();
      } else {
        await saveRecipe(recipe._id);
        setSaved(true);
      }
    } catch {
      toast.error(saved ? "Failed to unsave recipe" : "Failed to save recipe");
    }
  }, [recipe, saved, saveRecipe, unsaveRecipe]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }, []);

  const handleAddToCollection = useCallback(
    async (collectionId: string) => {
      if (!recipeId) return;
      setAddingCollectionId(collectionId);
      try {
        await addRecipeToCollection({ recipeId, collectionId });
        if (!saved) {
          await saveRecipe(recipeId);
          setSaved(true);
        }
        await getCollections();
      } catch {
        toast.error("Failed to add recipe to collection");
      } finally {
        setAddingCollectionId(null);
      }
    },
    [recipeId, saved, addRecipeToCollection, saveRecipe],
  );

  const handleRemoveFromCollection = useCallback(
    async (collectionId: string) => {
      if (!recipeId) return;
      setAddingCollectionId(collectionId);
      try {
        await removeRecipeFromCollection({ recipeId, collectionId });
        await getCollections();
      } catch {
        toast.error("Failed to remove recipe from collection");
      } finally {
        setAddingCollectionId(null);
      }
    },
    [recipeId, saved, removeRecipeFromCollection, unsaveRecipe],
  );

  if (!recipe) {
    return (
      <div className="pt-[80px] px-[20px] md:px-[122px] py-[40px]">
        <p>Loading recipe…</p>
      </div>
    );
  }

  const platformDetails =
    platforms.find(
      (p) => p.name.toLowerCase() === recipe.source?.platform?.toLowerCase(),
    ) ?? platforms[0];

  document.title = `${recipe.title} | DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From`;

  return (
    <div className="pt-[80px]">
      <div className="py-[40px] px-[20px] md:px-[122px] border-b border-accent-primary/50">
        <div className="flex items-center gap-[10px] py-[30px]">
          <SocialMediaBadge
            name={platformDetails.name}
            className={platformDetails.className}
          />
          {recipe.source?.videoUrl && (
            <a
              href={recipe.source.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[5px] text-sm font-medium cursor-pointer hover:border-text-primary border-b border-transparent"
            >
              <HugeiconsIcon
                icon={ExternalLinkIcon}
                size={16}
                strokeWidth={2}
              />
              View original video
            </a>
          )}
        </div>
        <div className="space-y-[10px] pb-[30px]">
          <h1 className="text-4xl font-black font-heading">{recipe.title}</h1>
          <p className="opacity-60">{recipe.description}</p>
          <div className="flex items-center gap-[5px] flex-wrap">
            {recipe.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[7px] flex-wrap pb-[30px]">
          <RecipeWidget
            icon={Clock4Icon}
            title="Prep + Cook"
            value={recipe.estimatedTime + " min"}
          />
          <RecipeWidget
            icon={UserGroupIcon}
            title="Servings"
            value={recipe.servings + " people"}
          />
          <RecipeWidget
            icon={PuzzleIcon}
            title="Difficulty"
            value={recipe.difficulty}
          />
          <RecipeWidget
            icon={Fire02Icon}
            title="Calories"
            value={recipe.estimatedCalories}
          />
          <RecipeWidget
            icon={Money03Icon}
            title="Cost"
            value={recipe.estimatedCost}
          />
          <p className="w-full text-sm opacity-40 flex items-start gap-[5px] mt-[10px]">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={20}
              className="shrink-0"
            />
            All data are estimated and generated with AI. If you see any data
            wrong, edit the recipe.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 md:w-fit gap-[10px]">
          <Button
            className="col-span-2 md:col-span-1"
            onClick={handleSaveToggle}
          >
            <HugeiconsIcon
              icon={Bookmark02Icon}
              size={18}
              strokeWidth={2.5}
              className={saved ? "fill-white" : undefined}
            />
            {saved ? "Unsave Recipe" : "Save Recipe"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOpenCollectionModal(true)}
          >
            <HugeiconsIcon icon={CopyPlusIcon} size={18} strokeWidth={2.5} />
            Add to Collection
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={2.5} />
            Share
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`/r/${recipeId}/edit`)}
            disabled={!saved}
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={18}
              strokeWidth={2.5}
            />
            Edit Recipe
          </Button>
        </div>
      </div>
      <div className="px-[20px] md:px-[122px] py-[40px] border-b border-border-default grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        <IngredientsCard ingredients={recipe.ingredients} />
        <InstructionsCard instructions={recipe.steps} />
      </div>
      <div className="px-[20px] md:px-[122px] py-[40px]">
        <ShareRecipeCard />
      </div>
      <StartBanner />
      <AnimatePresence>
        {openCollectionModal && (
          <div role="dialog" aria-modal="true" aria-label="Add to collection">
            <div
              className="fixed inset-0 bg-black/15 z-50"
              onClick={() => setOpenCollectionModal(false)}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.05, 1] }}
              exit={{
                scale: 0,
                transition: { duration: 0.15, ease: "easeInOut" },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-5
              rounded-md w-[500px] divide-y divide-border-default overflow-auto w-[90%] md:w-[400px]
              max-h-[calc(100vh-125px)]"
            >
              {collections.length > 0 ? (
                collections.map((collection) => {
                  const containsRecipe = collection.recipes!.some(
                    (r: any) => r.recipeId._id === recipeId,
                  );
                  const isAdding = addingCollectionId === collection._id;

                  return (
                    <div
                      key={collection._id}
                      className="flex items-center justify-between gap-2 p-2"
                    >
                      <p>{collection.name}</p>

                      {containsRecipe ? (
                        <Button
                          aria-label={`Remove recipe from ${collection.name}`}
                          disabled={isAdding}
                          onClick={() =>
                            handleRemoveFromCollection(collection._id)
                          }
                          size="sm"
                        >
                          <HugeiconsIcon
                            icon={CheckIcon}
                            size={15}
                            strokeWidth={2.5}
                          />
                        </Button>
                      ) : (
                        <Button
                          aria-label={`Add recipe to ${collection.name}`}
                          disabled={isAdding}
                          onClick={() => handleAddToCollection(collection._id)}
                          size="sm"
                          variant="secondary"
                        >
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            size={15}
                            strokeWidth={2.5}
                            className={isAdding ? "opacity-40" : undefined}
                          />
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="space-y-3 p-2">
                  <p>No Collections Found</p>
                  <Button size="sm" onClick={() => navigate("/c")}>
                    Create New Collection
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recipe;
