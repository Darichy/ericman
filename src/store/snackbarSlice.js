// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    showSnackbar: { status: false, type: "", message: "" },
  },
  reducers: {
    setShowSnackbar: (state, action) => {
      // Update the state immediately based on the action payload
      state.showSnackbar = action.payload;
    },
  },
});

export const { setShowSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
