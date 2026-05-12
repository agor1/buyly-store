"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId,
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "buyly-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
