// socket.js or socket.ts
import { Server } from "socket.io";
import http from "http";

export const initSocket = (server) => {
  const httpServer = http.createServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return { io, httpServer };
};
