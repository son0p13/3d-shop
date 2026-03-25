import { create } from 'zustand';

// Định nghĩa cấu trúc của một món hàng trong giỏ
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  material?: string; 
  size?: string;
}


interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  decreaseQuantity: (id: string) => void; 
  updateQuantity: (id: string, quantity: number) => void; 
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((c) => c._id === item._id);
      if (existingItem) {
        return {
          cart: state.cart.map((c) =>
            c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  decreaseQuantity: (id) =>
    set((state) => {
      const existingItem = state.cart.find((c) => c._id === id);

      if (existingItem?.quantity === 1) {
        return { cart: state.cart.filter((c) => c._id !== id) };
      }
      return {
        cart: state.cart.map((c) =>
          c._id === id ? { ...c, quantity: c.quantity - 1 } : c
        ),
      };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((c) => c._id !== id) };
      }
      return {
        cart: state.cart.map((c) =>
          c._id === id ? { ...c, quantity: quantity } : c
        ),
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((c) => c._id !== id),
    })),
    
  clearCart: () => set({ cart: [] }),
}));