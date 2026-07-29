import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import Recipe from '../recipe/recipe.model';
import SavedRecipe from './saved.model';
import Collection from '../collection/collection.model';

export const updateSavedRecipe = async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      tags,
      servings,
      estimatedTime,
      estimatedCalories,
      estimatedCost,
      difficulty,
      isPublic
    } = req.body || {};
    const userId = req.user?._id;
    const recipeId = req.params.id;
    const updateData: any = {};

    if (!userId || !recipeId) {
      return res.status(400).json({ success: false, message: 'Missing user ID or recipe ID' });
    }

    const recipe = await SavedRecipe.findOne({ userId, recipeId });

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Saved recipe not found' });
    }

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (ingredients) updateData.ingredients = ingredients;
    if (steps) updateData.steps = steps;
    if (tags) updateData.tags = tags;
    if (servings) updateData.servings = servings;
    if (estimatedTime) updateData.estimatedTime = estimatedTime;
    if (estimatedCalories) updateData.estimatedCalories = estimatedCalories;
    if (estimatedCost) updateData.estimatedCost = estimatedCost;
    if (difficulty) updateData.difficulty = difficulty;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: { ...updateData, isEdited: true } },
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error in updateSavedRecipe controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// export const deleteSavedRecipe = async (req: ExtendedRequest, res: Response) => {
//   try {
//     const userId = req.user?._id;
//     const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//     if (!userId || !id) {
//       return res.status(400).json({ success: false, message: 'Missing user ID or recipe ID' });
//     }

//     const query: any = { userId };
//     if (mongoose.Types.ObjectId.isValid(id)) {
//     //   query.$or = [{ _id: id }, { recipeId: id }];
//     // } else {
//       query.recipeId = id;
//     }

//     const savedRecipe = await SavedRecipe.deleteMany({
//       userId,
//       recipeId: id
//     });
//     // if (!savedRecipe) {
//     //   return res.status(404).json({ success: false, message: 'Saved recipe not found' });
//     // }

//     return res.json({ success: true, message: 'Saved recipe deleted successfully' });
//   } catch (error) {
//     console.error('Error in deleteSavedRecipe controller:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }
export const deleteSavedRecipe = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const { id: recipeId } = req.params;

    if (!userId || !recipeId) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID or recipe ID",
      });
    }

    const result = await SavedRecipe.deleteMany({
      userId,
      recipeId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved recipe not found",
      });
    }

    return res.json({
      success: true,
      message: "Recipe removed successfully",
    });
  } catch (error) {
    console.error("Error in deleteSavedRecipe controller:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSavedRecipes = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string || '';
    const sort = req.query.sort as string || 'recent';
    const platform = req.query.platform as string || '';

    const query: any = {};
    if (search) {
      query.$or = [
        {
          "recipe.title": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "recipe.ingredients.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "recipe.tags": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "recipe.source.videoTitle": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "recipe.source.authorName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    };
    if (platform) query["recipe.source.platform"] = platform.toLowerCase();

    const sortOption: any = {};

    switch (sort) {
      case 'recent':
        sortOption.createdAt = -1;
        break;
      case 'oldest':
        sortOption.createdAt = 1;
        break;
      case 'a-z':
        sortOption["recipe.title"] = -1;
        break;
      case 'cook-time':
        sortOption["recipe.estimatedTime"] = -1;
        break;
      default:
        sortOption.createdAt = -1;
        break;
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing user ID' });
    }
    // const recipes = await SavedRecipe.find(query).
    //   populate('recipeId').
    //   skip((+page - 1) * +limit).
    //   limit(limit).
    //   sort(sortOption);

    const recipes = await SavedRecipe.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$recipeId', savedRecipe: { $first: "$$ROOT" },
        }
      },
      {
        $replaceRoot: {
          newRoot: "$savedRecipe",
        }
      },
      { $lookup: { from: 'recipes', localField: 'recipeId', foreignField: '_id', as: 'recipe' } },
      { $unwind: '$recipe' },
      { $match: query },
      { $sort: sortOption },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const totalRecipes = (
      await SavedRecipe.aggregate([
        { $match: { userId } },
        { $group: { _id: '$recipeId', recipeId: { $first: "$recipeId" } } },
        {
          $lookup: {
            from: "recipes",
            localField: "recipeId",
            foreignField: "_id",
            as: "recipe",
          },
        },
        { $unwind: "$recipe" },
        { $match: query },
        { $count: "count" },
      ])
    )[0]?.count || 0;

    return res.json({
      success: true,
      message: 'Saved recipes retrieved successfully',
      data: {
        recipes,
        totalRecipes,
        page,
        pages: Math.ceil(totalRecipes / limit)
      }
    });
  } catch (error) {
    console.error('Error in getSavedRecipes controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const savedRecipeInCollectionStatus = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const recipeId = req.params.id;
    const collectionId = req.params.collectionId;

    if (!userId || !recipeId || !collectionId) {
      return res.status(400).json({ success: false, message: 'Missing user ID, recipe ID, or collection ID' });
    }

    const savedRecipe = await SavedRecipe.findOne({ userId, recipeId, collectionId });

    if (!savedRecipe) {
      return res.status(200).json({
        success: true,
        data: {
          saved: false,
          collections: []
        }
      })
    }

    const collections = await SavedRecipe.find({ userId, recipeId }).populate({
      path: 'collectionId', select: 'name'
    }).select('collectionId');

    const collectionsResult = collections.map(collection => collection.collectionId);

    return res.json({
      success: true,
      data: {
        saved: true,
        collections: collectionsResult
      }
    });

  } catch (error) {
    console.error('Error in savedRecipeStatus controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}