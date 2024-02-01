// // websocketMiddleware.js

// import { setSocket, setConnected } from "../websocketSlice";
// import io from "socket.io-client";

// const socketMiddleware = () => (dispatch) => {
//   const socket = io("http://localhost:3001");

//   socket.on("connect", () => {
//     dispatch(setSocket(socket));
//     // dispatch(setConnected(true));
//   });

//   socket.on("disconnect", () => {
//     dispatch(setSocket(null));
//     // dispatch(setConnected(false));
//   });

//   // ... other Socket.io event listeners and interactions

//   return () => {
//     socket.disconnect();
//   };
// };

// export default socketMiddleware;
