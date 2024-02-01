// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "Auth",
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    decrement: (state) => state - 1,
  },
});

export const { authenticate, decrement } = authSlice.actions;
export default authSlice.reducer;
