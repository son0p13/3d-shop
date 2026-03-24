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

// Khai báo danh sách các kỹ năng của Giỏ hàng
interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  decreaseQuantity: (id: string) => void; // Kỹ năng trừ bớt 1 sản phẩm
  updateQuantity: (id: string, quantity: number) => void; // Kỹ năng gõ số lượng trực tiếp
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  
  // 1. Thêm vào giỏ (Nếu trùng _id thì cộng dồn số lượng)
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

  // 2. Trừ bớt khỏi giỏ (Bấm dấu trừ)
  decreaseQuantity: (id) =>
    set((state) => {
      const existingItem = state.cart.find((c) => c._id === id);
      // Nếu số lượng đang là 1 mà khách bấm trừ thì xóa luôn món đó
      if (existingItem?.quantity === 1) {
        return { cart: state.cart.filter((c) => c._id !== id) };
      }
      // Nếu số lượng > 1 thì trừ đi 1
      return {
        cart: state.cart.map((c) =>
          c._id === id ? { ...c, quantity: c.quantity - 1 } : c
        ),
      };
    }),

  // 3. Cập nhật số lượng trực tiếp (Khi khách gõ số vào ô input)
  updateQuantity: (id, quantity) =>
    set((state) => {
      // Nếu khách lỡ gõ số 0 hoặc số âm thì tự động xóa sản phẩm
      if (quantity <= 0) {
        return { cart: state.cart.filter((c) => c._id !== id) };
      }
      // Ngược lại thì gán đúng số lượng khách nhập
      return {
        cart: state.cart.map((c) =>
          c._id === id ? { ...c, quantity: quantity } : c
        ),
      };
    }),

  // 4. Bấm nút thùng rác là bay màu ngay lập tức
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((c) => c._id !== id),
    })),
    
  // 5. Xóa trắng toàn bộ giỏ hàng
  clearCart: () => set({ cart: [] }),
}));