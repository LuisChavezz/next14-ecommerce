import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
  // State
  cart: CartProduct[];

  // Actions
  addToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      // Initial State
      cart: [],

      // Methods
      addToCart: (product: CartProduct) => {
        const { cart } = get();

        // Check if product is already in cart with the same size
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        )

        // If product is not in cart, add it
        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // If product is in cart, update the quantity
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });

        set({ cart: updatedCart });

      }
    })
    , { // Persist config
      name: 'shopping-cart',
    }
  )
);