import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboardPeriod: 'today', // e.g., 'today', 'week', 'month'
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setDashboardPeriod: (state, action) => {
      state.dashboardPeriod = action.payload;
    },
  },
});

export const { setDashboardPeriod } = ownerSlice.actions;
export default ownerSlice.reducer;
