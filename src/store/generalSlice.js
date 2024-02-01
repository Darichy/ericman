// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const general = createSlice({
  name: "general",
  initialState: {
    user: {},
    screenWidth: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setScreenWidthx: (state, action) => {
      state.screenWidth = action.payload;
    },
  },
});

export const { setUser, setScreenWidthx } = general.actions;
export default general.reducer;
