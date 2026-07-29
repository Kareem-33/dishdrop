import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import type { IRecipe } from "./useRecipeStore.js";

interface SavedStore {
  recipes: Array<any>;
  count: number;
  pages: number;
  totalSaved: number;
  recipeCollections: { _id: string, name: string }[];
  loading: boolean;

  fetchSavedRecipes: ({ page, limit, search, sort, platform }: { page?: number, limit?: number, search?: string, sort?: string, platform?: string }) => void;
  unsaveRecipe: ({ recipeId }: { recipeId: string }) => Promise<boolean>;
  savedRecipesCount: () => void;
  updateSavedRecipe: ({ recipeId, updateData }: { recipeId: string, updateData: Partial<IRecipe> }) => Promise<string>;
  savedRecipeInCollectionStatus: ({ recipeId, collectionId }: { recipeId: string, collectionId: string }) => Promise<any>;
}

const useSavedStore = create<SavedStore>((set) => ({
  recipes: [],
  count: 0,
  pages: 0,
  totalSaved: 0,
  recipeCollections: [],
  loading: false,

  fetchSavedRecipes: async ({ page = 1, limit = 10, search = '', sort = 'recent', platform = '' }) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/saved?page=${page}&limit=${limit}&search=${search}&sort=${sort}&platform=${platform}`);
      const recipes = response.data.data.recipes;
      const count = response.data.data.totalRecipes;
      const pages = response.data.data.pages;

      return set({ recipes: recipes, count: count, pages: pages });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  unsaveRecipe: async ({ recipeId }) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/saved/${recipeId}`);
      set((prev) => {
        return {
          recipes: prev.recipes.filter((r) => r._id !== recipeId),
          count: Math.max(0, prev.count - 1),
          totalSaved: Math.max(0, (prev.totalSaved || 0) - 1),
        };
      });

      toast.success(response.data.message);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data.message || "An error occurred");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  savedRecipesCount: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/saved');
      return set({ totalSaved: response.data.data.totalRecipes });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  updateSavedRecipe: async ({ recipeId, updateData }) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/saved/${recipeId}`, updateData);
      return toast.success(response.data.message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  savedRecipeInCollectionStatus: async ({ recipeId, collectionId }) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/collections/${collectionId}/recipes/${recipeId}`);
      const collections = response.data.data.collections;
      return set({ recipeCollections: collections });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSavedStore;