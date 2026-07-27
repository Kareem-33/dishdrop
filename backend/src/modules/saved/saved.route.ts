import { Router } from 'express';
import { deleteSavedRecipe, getSavedRecipes, updateSavedRecipe, savedRecipeInCollectionStatus } from './saved.controller';
import { protectRoute } from '../../middleware/auth.middleware';

const router = Router();

router.get("/", protectRoute, getSavedRecipes);
router.get("/:id/collections/:collectionId", protectRoute, savedRecipeInCollectionStatus);

router.put('/:id', protectRoute, updateSavedRecipe);
router.delete('/:id', protectRoute, deleteSavedRecipe);

export default router;