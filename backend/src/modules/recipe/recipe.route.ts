import {Router} from 'express';
import {
  analyzeRecipe,
  createRecipe,
  getRecipe
} from './recipe.controller';
import { protectRoute } from '../../middleware/auth.middleware';

const router = Router();

router.get('/:id', getRecipe);

router.post('/analyze', analyzeRecipe);
router.post('/:id', protectRoute, createRecipe);

export default router;