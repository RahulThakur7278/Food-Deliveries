import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import shopReducer from '../features/shop/shopSlice';
import ownerReducer from '../features/owner/ownerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    owner: ownerReducer,
  },
});
