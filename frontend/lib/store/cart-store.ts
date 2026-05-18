"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import * as cartApi from "@/lib/api/cart";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
};

type CartStore = {
  ownerUserId: string | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  loadCart: () => Promise<void>;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCartOwner: (userId: string | null) => void;
};

const mapCartItems = (items: cartApi.CartItemResponse[]): CartItem[] =>
  items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    price: Number(item.product.price),
    quantity: item.quantity,
  }));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ownerUserId: null,
      items: [],
      isLoading: false,
      error: null,

      loadCart: async () => {
        if (!get().ownerUserId) {
          set({ items: [], isLoading: false, error: null });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const cart = await cartApi.getCart();
          set({ items: mapCartItems(cart), isLoading: false });
        } catch {
          set({
            isLoading: false,
            error: "Nie udało się pobrać koszyka.",
          });
        }
      },

      addItem: async (item, quantity = 1) => {
        if (!get().ownerUserId) {
          const message = "Zaloguj się, aby dodać produkt do koszyka.";

          set({ error: message });
          toast.error(message);
          return;
        }

        try {
          set({ error: null });
          const cart = await cartApi.addCartItem({
            productId: item.productId,
            quantity,
          });
          set({ items: mapCartItems(cart) });
          toast.success("Produkt dodany do koszyka.");
        } catch {
          const message = "Nie udało się dodać produktu do koszyka.";

          set({
            error: message,
          });
          toast.error(message);
        }
      },

      removeItem: async (productId) => {
        if (!get().ownerUserId) {
          set({ items: [] });
          return;
        }

        try {
          set({ error: null });
          const cart = await cartApi.removeCartItem(productId);
          set({ items: mapCartItems(cart) });
          toast.success("Produkt usunięty z koszyka.");
        } catch {
          const message = "Nie udało się usunąć produktu z koszyka.";

          set({
            error: message,
          });
          toast.error(message);
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (!get().ownerUserId) {
          set({ items: [] });
          return;
        }

        try {
          set({ error: null });
          const cart =
            quantity <= 0
              ? await cartApi.removeCartItem(productId)
              : await cartApi.updateCartItem(productId, { quantity });

          set({ items: mapCartItems(cart) });
          toast.success("Koszyk zaktualizowany.");
        } catch {
          const message = "Nie udało się zaktualizować koszyka.";

          set({
            error: message,
          });
          toast.error(message);
        }
      },

      clearCart: async () => {
        if (!get().ownerUserId) {
          set({ items: [] });
          return;
        }

        try {
          set({ error: null });
          const cart = await cartApi.clearCart();
          set({ items: mapCartItems(cart) });
          toast.success("Koszyk wyczyszczony.");
        } catch {
          const message = "Nie udało się wyczyścić koszyka.";

          set({
            error: message,
          });
          toast.error(message);
        }
      },

      setCartOwner: (userId) =>
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
    }),
    {
      name: "buyly-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ ownerUserId, items }) => ({ ownerUserId, items }),
    },
  ),
);
