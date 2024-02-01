// import { NextApiRequest } from "next";
// import { NextApiResponseServerIO } from "src/types/next";
// import { Server as ServerIO } from "socket.io";
// import { Server as NetServer } from "http";
// import { createRouter, expressWrapper } from "next-connect";
// const router = createRouter();
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// router.use()
// export default async (req, res) => {
//   if (!res.socket.server.io) {
//     console.log("New Socket.io server...");
//     // adapt Next's net Server to http Server
//     const httpServer = res.socket.server;
//     const io = new ServerIO(httpServer, {
//       path: "/api/socket",
//     });
//     // append SocketIO server to Next.js socket server response
//     res.socket.server.io = io;
//   }
//   res.end();
// };

import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
