import { create } from "zustand";
import api from "../../lib/axios";

export type Upload = {
  id: string;
  path: string;
};

export type ProductOption = {
  id: string;
  name: string;
  price: number;
};

export type ProductOptionGroup = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  sortOrder: number;
  options: ProductOption[];
};

export type ProductCategory = {
  id: string;
  name: string;
  upload: Upload | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  upload: Upload | null;
  category: ProductCategory | null;
  optionGroups: ProductOptionGroup[];
};

export type ProductMeta = {
  total: number;
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
};

type ProductResponse = {
  status: number;
  message: string;
  data: {
    data: Product[];
    meta: ProductMeta;
  };
};

type SingleProductResponse = {
  status: number;
  message: string;
  data: Product;
};

export type FetchProductsParams = {
  categoryId?: string;
  cursor?: string;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
};

type ProductState = {
  products: Product[];
  meta: ProductMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  getById: (id: string) => Product | undefined;
  getByCategory: (categoryId: string) => Product[];
  getFeatured: () => Product[];
};

let latestRequestId = 0;

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  meta: null,
  isLoading: false,
  error: null,

  fetchProducts: async (params) => {
    const requestId = ++latestRequestId;
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (params?.categoryId) query.set("categoryId", params.categoryId);
      if (params?.cursor) query.set("cursor", params.cursor);
      if (params?.search) query.set("search", params.search);
      if (params?.isFeatured !== undefined)
        query.set("isFeatured", String(params.isFeatured));
      if (params?.limit) query.set("limit", String(params.limit));

      const qs = query.toString();
      const res = await api.get<ProductResponse>(
        `/products/all${qs ? `?${qs}` : ""}`,
      );

      if (requestId !== latestRequestId) return; 

      set({
        products: res.data.data.data,
        meta: res.data.data.meta,
        isLoading: false,
      });
    } catch (err) {
      if (requestId !== latestRequestId) return;
      set({ error: "Failed to load products", isLoading: false });
    }
  },

  
  fetchProductById: async (id) => {
    const existing = get().products.find((p) => p.id === id);
    if (existing) return existing;

    try {
      const res = await api.get<SingleProductResponse>(`/products/${id}`);
      const product = res.data.data;

      set((state) => {
        const alreadyThere = state.products.some((p) => p.id === product.id);
        return {
          products: alreadyThere
            ? state.products.map((p) => (p.id === product.id ? product : p))
            : [...state.products, product],
        };
      });

      return product;
    } catch (err) {
      return null;
    }
  },

  getById: (id) => get().products.find((p) => p.id === id),

  getByCategory: (categoryId) =>
    get().products.filter((p) => p.category?.id === categoryId),

  getFeatured: () => get().products.filter((p) => p.isFeatured),
}));