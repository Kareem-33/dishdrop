import { create } from 'zustand';
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export interface IIngredient {
  amount: string,
  unit: string,
  name: string
};

export interface ISource {
  platform: string,
  videoUrl: string,
  thumbnail: string | null,
  authorName: string | null,
  videoTitle: string | null
};

export interface IRecipe {
  _id: string,
  title: string,
  description?: string | null,
  ingredients: IIngredient[],
  steps: string[],
  tags: string[],
  servings: number,
  estimatedTime: number,
  estimatedCalories: string,
  estimatedCost: string,
  difficulty: string,
  source: ISource | null,
  aiModel: string,
  isPublic?: boolean,
  isEdited?: boolean,
  createdAt: Date,
  updatedAt: Date
};

interface IRecipeStore {
  recipe: IRecipe | null;
  analyzedId: string | null;
  loading: boolean;

  getRecipe: (recipeId: string) => void;
  analyzeRecipe: (videoLink: string) => void;
  saveRecipe: (recipeId: string) => Promise<string>;
};

const useRecipeStore = create<IRecipeStore>((set) => ({
  recipe: null,
  analyzedId: null,
  loading: false,

  getRecipe: async (recipeId: string) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/recipes/${recipeId}`);
      console.log(response || "No response");
      return set({ recipe: response.data.data });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  analyzeRecipe: async (videoLink: string) => {
    set({ loading: true });
    try {
      const response = await axios.post("/recipes/analyze", { videoLink });
      console.log(response.data.data.recipe._id || "No response");
      return set({ recipe: response.data.data.recipe, analyzedId: response.data.data.recipe._id });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  saveRecipe: async (recipeId: string) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/recipes/${recipeId}`);
      return toast.success(response.data.message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  }
}));

export default useRecipeStore;