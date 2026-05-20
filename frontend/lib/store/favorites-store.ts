"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";

import type { Product } from "@/lib/api/products";
import * as favoritesApi from "@/lib/api/favorites";

export type FavoriteItem = {
  product: Product;
  productId: string;
};

type FavoritesStore = {
  ownerUserId: string | null;
  items: FavoriteItem[];
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  addFavorite: (product: Product) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  setFavoritesOwner: (userId: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  toggleFavorite: (product: Product) => Promise<void>;
};

const mapFavoriteItems = (
  items: favoritesApi.FavoriteItemResponse[],
): FavoriteItem[] =>
  items.map((item) => ({
    product: item.product,
    productId: item.product.id,
  }));

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ownerUserId: null,
      items: [],
      hasHydrated: false,
      isLoading: false,
      error: null,

      loadFavorites: async () => {
        if (!get().ownerUserId) {
          set({ items: [], isLoading: false, error: null });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const favorites = await favoritesApi.getFavorites();
          set({ items: mapFavoriteItems(favorites), isLoading: false });
        } catch {
          const message = "Nie udało się pobrać ulubionych produktów.";

          set({ isLoading: false, error: message });
          toast.error(message);
        }
      },

      addFavorite: async (product) => {
        if (!get().ownerUserId) {
          const message = "Zaloguj się, aby dodać produkt do ulubionych.";

          set({ error: message });
          toast.error(message);
          return;
        }

        try {
          set({ error: null });
          const favorites = await favoritesApi.addFavoriteItem({
            productId: product.id,
          });
          set({ items: mapFavoriteItems(favorites) });
          toast.success("Produkt dodany do ulubionych.");
        } catch {
          const message = "Nie udało się dodać produktu do ulubionych.";

          set({ error: message });
          toast.error(message);
        }
      },

      removeFavorite: async (productId) => {
        if (!get().ownerUserId) {
          set({ items: [] });
          return;
        }

        try {
          set({ error: null });
          const favorites = await favoritesApi.removeFavoriteItem(productId);
          set({ items: mapFavoriteItems(favorites) });
          toast.success("Produkt usunięty z ulubionych.");
        } catch {
          const message = "Nie udało się usunąć produktu z ulubionych.";

          set({ error: message });
          toast.error(message);
        }
      },

      clearFavorites: async () => {
        if (!get().ownerUserId) {
          set({ items: [] });
          return;
        }

        try {
          set({ error: null });
          const favorites = await favoritesApi.clearFavorites();
          set({ items: mapFavoriteItems(favorites) });
          toast.success("Ulubione produkty zostały wyczyszczone.");
        } catch {
          const message = "Nie udało się wyczyścić ulubionych produktów.";

          set({ error: message });
          toast.error(message);
        }
      },

      isFavorite: (productId) =>
        get().items.some((item) => item.productId === productId),

      toggleFavorite: async (product) => {
        if (get().isFavorite(product.id)) {
          await get().removeFavorite(product.id);
          return;
        }

        await get().addFavorite(product);
      },

      setFavoritesOwner: (userId) =>
        set((state) => {
          if (!userId) {
            return {
              ownerUserId: null,
              items: [],
              error: null,
            };
          }

          if (state.ownerUserId === userId) {
            return { ownerUserId: userId };
          }

          return {
            ownerUserId: userId,
            items: [],
            error: null,
          };
        }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "buyly-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ ownerUserId, items }) => ({ ownerUserId, items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
