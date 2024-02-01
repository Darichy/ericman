import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import snackbarReducer from "./snackbarSlice";
import websocketReducer from "./websocketSlice";
import notificationReducer from "./notificationSlice";
import socketMiddleware from "./middlewares/websocketMiddlware";
import themeSlice from "./themeSlice";
import general from "./generalSlice";

const store = configureStore({
  reducer: {
    authReducer,
    snackbar: snackbarReducer,
    websocket: websocketReducer,
    notification: notificationReducer,
    theme: themeSlice,
    general,
    // Add more reducers here if needed
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(socketMiddleware),
});

export default store;
