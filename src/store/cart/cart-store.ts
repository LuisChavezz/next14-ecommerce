import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
  // State
  cart: CartProduct[];

  // Actions
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    taxes: number;
    total: number;
    itemsInCart: number;
  }

  addToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      // Initial State
      cart: [],

      // Methods
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity) , 0);
        const taxes = subTotal * 0.15;
        const itemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

        return {
          subTotal,
          taxes,
          total: subTotal + taxes,
          itemsInCart,
        };
      },

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

      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ cart: updatedCart });
      },

      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: updatedCart });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    })
    , { // Persist config
      name: 'shopping-cart',
    }
  )
);