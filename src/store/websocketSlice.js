// websocketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    emitEvent: (state, action) => {
      if (state.socket) {
        state.socket.emit(action.payload.eventName, action.payload.eventData);
      }
    },
  },
});

export const { setSocket, emitEvent } = websocketSlice.actions;
export default websocketSlice.reducer;
