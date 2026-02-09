import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return {
    items: [],
    subtotal: 0,
    discount: 20,
    deliveryFee: 15,
  };
};

const saveCartToStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      state.subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      );
      state.subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, selectedSize, selectedColor, quantity } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      state.subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
