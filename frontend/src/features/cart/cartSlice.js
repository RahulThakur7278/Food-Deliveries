import { createSlice } from '@reduxjs/toolkit';

// Helper to load cart state from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('food_delivery_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

// Helper to save cart state to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('food_delivery_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemId = newItem._id || newItem.id;
      const existingItem = state.items.find((item) => (item._id || item.id) === itemId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...newItem,
          id: itemId,
          quantity: 1,
        });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => (item._id || item.id) === itemId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => (item._id || item.id) !== itemId);
        }
      }
      saveCartToStorage(state.items);
    },
    deleteFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => (item._id || item.id) !== itemId);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalAmount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
