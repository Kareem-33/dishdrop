import { create } from 'zustand';
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import type { IRecipe } from './useRecipeStore.js';

export interface ICollection {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  recipesCount: number;
  recipes: IRecipe[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionState {
  collections: ICollection[];
  collection: ICollection | null;
  loading: boolean;
  error: string | null;

  createCollection: (data: any) => Promise<void>;
  getCollections: () => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  getCollectionData: (id: string) => Promise<void>;
  updateCollection: (data: any) => Promise<void>;

  addRecipeToCollection: ({ collectionId, recipeId }: { collectionId: string, recipeId: string }) => Promise<void>;
  removeRecipeFromCollection: ({ collectionId, recipeId }: { collectionId: string, recipeId: string }) => Promise<void>;
}

const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  collection: null,
  loading: false,
  error: null,
  createCollection: async ({ name, description, icon, color }) => {
    try {
      set({ loading: true });
      const response = await axios.post('/collections', { name, description, icon, color });
      if (response.status !== 201) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      set({ collections: [...get().collections, response.data.data] });
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  getCollections: async () => {
    try {
      set({ loading: true });
      const response = await axios.get('/collections');
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      set({ collections: response.data.data });
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  deleteCollection: async (id: string) => {
    try {
      set({ loading: true });
      const response = await axios.delete(`/collections/${id}`);
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      set({ collections: get().collections.filter((collection: any) => collection._id !== id) });
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  getCollectionData: async (id: string) => {
    try {
      set({ loading: true });
      const response = await axios.get(`/collections/${id}`);
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      set({ collection: response.data.data });
    } catch (error: any) {
      set({ error: error.response?.data.message, collection: null });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  updateCollection: async ({ _id, name, description, icon, color }) => {
    try {
      set({ loading: true });
      const response = await axios.put(`/collections/${_id}`, { name, description, icon, color });
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  addRecipeToCollection: async ({ collectionId, recipeId }) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/collections/${collectionId}/recipes/${recipeId}`);
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  removeRecipeFromCollection: async ({ collectionId, recipeId }) => {
    try {
      set({ loading: true });
      const response = await axios.delete(`/collections/${collectionId}/recipes/${recipeId}`);
      if (response.status !== 200) {
        set({ error: response.data.message });
        throw new Error(response.data.message);
      }
      
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: error.response?.data.message });
      toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCollectionStore;