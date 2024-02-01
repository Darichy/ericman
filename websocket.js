// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const branchSockets = new Map();
try {
  io.on("connection", async (socket) => {
    // const session = await getSession({ req: socket.request });
    console.log("A user connected");

    socket.on("joinBranchRoom", (branchId) => {
      // Associate the branch ID with the socket connection
      branchSockets.set(branchId ?? "admin", socket);
      console.log(`Branch ${branchId ?? "admin"} connected`);
    });

    socket.on("sendNotification", ({ to, user }) => {
      const branchSocket = branchSockets.get(to);
      if (branchSocket) {
        // Emit the notification to the specific branch's socket
        branchSocket.emit(
          "notification",
          "Notification message for the branch"
        );
      } else {
        // Handle the case where the branch is not connected
        console.log(`Branch ${to} is not connected`);
        // Optionally, you can queue or log the notification for later delivery
      }
    });

    io.emit("onGetStatus", `Current Status`);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      for (const [branchId, branchSocket] of branchSockets.entries()) {
        if (branchSocket === socket) {
          branchSockets.delete(branchId);
          console.log(`Branch ${branchId} disconnected`);
        }
      }
    });
  });
} catch (error) {
  console.log(error);
}

server.listen(3001, () => {
  console.log("Socket.io server is running on port 3001");
});
