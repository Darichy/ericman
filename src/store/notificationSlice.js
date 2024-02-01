// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    selectedNotification: { status: false, type: "", id: "" },
  },
  reducers: {
    setSelectedNotification: (state, action) => {
      // Update the state immediately based on the action payload
      state.selectedNotification = action.payload;
    },
  },
});

export const { setSelectedNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
