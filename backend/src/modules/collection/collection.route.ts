import { Router } from 'express';
import { protectRoute } from '../../middleware/auth.middleware';
import {
  addRecipeToCollection,
  createCollection,
  deleteCollection,
  getCollectionData,
  getCollections,
  removeRecipeFromCollection,
  updateCollection
} from './collection.controller';

const router = Router();

router.get('/', protectRoute, getCollections);
router.post('/', protectRoute, createCollection);

router.get('/:id', protectRoute, getCollectionData);
router.put('/:id', protectRoute, updateCollection);
router.delete('/:id', protectRoute, deleteCollection);

router.post('/:id/recipes/:recipeId', protectRoute, addRecipeToCollection);
router.delete('/:id/recipes/:recipeId', protectRoute, removeRecipeFromCollection);

export default router;