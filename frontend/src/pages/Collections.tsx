import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Plus } from "@hugeicons/core-free-icons";
import Button from "../components/ui/Button";
import CollectionCard from "../components/ui/Collections/CollectionCard";
import NewCollectionModal from "../components/ui/Collections/NewCollectionModal";
import useCollectionStore from "../stores/useCollectionStore";

const Collections = () => {
  const { collections, getCollections } = useCollectionStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  useEffect(() => {
    getCollections();
  }, [])

    document.title = `Collections | DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From`;

  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] md:px-[122px] space-y-[35px] border-b border-border-default">
        <div className="space-y-[10px]">
          <h1 className="text-4xl font-black font-heading">Collections</h1>
          <p className="opacity-60">
            Organize your recipes into custom folders
          </p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <HugeiconsIcon icon={Plus} size={22} strokeWidth={2} />
            New collection
          </Button>
        </div>
        {/* <CollectionSearch /> */}
      </div>
      <div className="px-[20px] pt-[40px] md:px-[122px] pb-[60px] grid grid-cols-1 md:grid-cols-3 gap-[35px]">
        <div
          className="px-[20px] py-[40px] flex flex-col items-center justify-center gap-[20px]
          text-center border border-accent-primary border-dashed rounded-xl
          hover:bg-accent-primary/10 cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => setShowModal(true)}
        >
          <HugeiconsIcon
            icon={Plus}
            size={42}
            strokeWidth={2}
            className="text-accent-primary"
          />
          <div className="space-y-[5px]">
            <h3 className="text-lg font-bold">Create collection</h3>
            <p className="opacity-60 text-sm">
              Group recipes by category, occasion, or anything you like
            </p>
          </div>
        </div>
        {collections.map((collection) => (
          <CollectionCard
            key={collection._id}
            id={collection._id}
            icon={collection.icon}
            name={collection.name}
            description={collection.description}
            updateDate={collection.updatedAt}
            recipesCount={collection.recipesCount}
            color={collection.color}
          />
        ))}
      </div>
      {showModal && <NewCollectionModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Collections;
