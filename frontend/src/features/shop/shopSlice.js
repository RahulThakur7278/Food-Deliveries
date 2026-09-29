import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedShopId: null,
  filters: {
    city: '',
    search: '',
  },
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setSelectedShopId: (state, action) => {
      state.selectedShopId = action.payload;
    },
    setShopFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearShopFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setSelectedShopId, setShopFilters, clearShopFilters } = shopSlice.actions;
export default shopSlice.reducer;
