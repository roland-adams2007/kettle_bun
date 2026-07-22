import { create } from "zustand";
import api from "../../lib/axios";

export type Category = {
  id: string;
  name: string;
  coverImage: string;
};

type CategoryResponse = {
  status: number;
  message: string;
  data: Category[];
};

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchCategories: () => Promise<void>;
  getById: (id: string) => Category | undefined;
};

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchCategories: async () => {
    if (get().hasFetched || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<CategoryResponse>("/categories/all");
      set({ categories: res.data.data, isLoading: false, hasFetched: true });
    } catch (err) {
      set({ error: "Failed to load categories", isLoading: false });
    }
  },

  getById: (id) => get().categories.find((c) => c.id === id),
}));
