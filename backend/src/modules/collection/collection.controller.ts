import { Request, Response } from "express";
import { ExtendedRequest } from "../../middleware/auth.middleware";
import Collection from "./collection.model";
import SavedRecipe from "../saved/saved.model";

export const getCollections = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const collections = await Collection.find({ userId });

    if (!collections) {
      return res.status(404).json({ success: false, message: "Collections not found" });
    }

    const newCollections = await Promise.all(
      collections.map(async (collection) => {
        const collectionId = collection._id;
        const recipes = await SavedRecipe.find({ collectionId, userId }).populate('recipeId');

        return {
          ...collection.toObject(),
          recipesCount: recipes.length,
          recipes,
        }
      })
    );

    res.status(200).json({ success: true, message: "Collections fetched successfully", data: newCollections });
  } catch (error) {
    console.error('Error in getCollections controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const createCollection = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, description, icon, color } = req.body || {};

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!name || !icon || !color) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const newCollection = await Collection.create({ name, description, icon, color, userId });
    res.status(201).json({ success: true, data: newCollection });
  } catch (error) {
    console.error('Error in createCollection controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getCollectionData = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const collectionId = req.params.id;

    if (!userId || !collectionId) {
      return res.status(400).json({ success: false, message: 'Missing user ID or collection ID' });
    }
    const collection = await Collection.findOne({ _id: collectionId, userId });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    const collectionItems = await SavedRecipe.find({ collectionId, userId }).populate('recipeId');
    res.status(200).json({
      success: true,
      data: {
        ...collection.toObject(),
        recipes: collectionItems,
        recipesCount: collectionItems.length
      }
    });
  } catch (error) {
    console.error('Error in getCollectionData controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const updateCollection = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const collectionId = req.params.id;
    const { name, description, icon, color } = req.body || {};

    if (!userId || !collectionId) {
      return res.status(400).json({ success: false, message: 'Missing user ID or collection ID' });
    }

    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      { $set: { name, description, icon, color } },
      { new: true }
    );
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error('Error in updateCollection controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const deleteCollection = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const collectionId = req.params.id;

    if (!userId || !collectionId) {
      return res.status(400).json({ success: false, message: 'Missing user ID or collection ID' });
    }
    const collection = await Collection.findOneAndDelete({ _id: collectionId, userId });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    await SavedRecipe.updateMany(
      { collectionId, userId },
      { $set: { collectionId: null } }
    );

    return res.status(200).json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCollection controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const addRecipeToCollection = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const collectionId = req.params.id as string;
    const recipeId = req.params.recipeId as string;

    if (!userId || !collectionId || !recipeId) {
      return res.status(400).json({ success: false, message: 'Missing user ID, collection ID, or recipe ID' });
    }

    const collection = await Collection.findOne({ _id: collectionId, userId });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    const savedRecipeExists = await SavedRecipe.findOne(
      { userId, recipeId, collectionId }
    );

    if (savedRecipeExists) {
      return res.status(400).json({ success: false, message: 'Recipe already added to collection' });
    }

    const savedRecipe = await SavedRecipe.create({
      userId,
      recipeId,
      collectionId
    });
    if (!savedRecipe) {
      return res.status(404).json({ success: false, message: 'Failed to add recipe to collection' });
    }

    res.status(200).json({ success: true, message: 'Recipe added to collection successfully', data: savedRecipe });
  } catch (error) {
    console.error('Error in addRecipeToCollection controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const removeRecipeFromCollection = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const collectionId = req.params.id;
    const recipeId = req.params.recipeId;

    if (!userId || !collectionId || !recipeId) {
      return res.status(400).json({ success: false, message: 'Missing user ID, collection ID, or recipe ID' });
    }

    const savedRecipe = await SavedRecipe.findOne({ userId, recipeId, collectionId });
    if (!savedRecipe) {
      return res.status(404).json({ success: false, message: 'Saved recipe not found in the specified collection' });
    }
    savedRecipe.collectionId = null;
    await savedRecipe.save();

    res.status(200).json({ success: true, message: 'Recipe removed from collection successfully' });
  } catch (error) {
    console.error('Error in removeRecipeFromCollection controller:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}