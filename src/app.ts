import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cron from "node-cron";
import path from "path";
import { Server } from "socket.io";

import http from "http";

import { deleteUnverifiedUsers } from "./app/utils/deleteUnverifiedUser";
import AppError from "./app/errors/AppError";
import httpStatus from "http-status";
import { chatService } from "./app/module/chat/chat.service";
const app: Application = express();
const server = http.createServer(app);
//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://celebrated-kitten-1b6ccf.netlify.app",
      "https://amz-book-review.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://api.booksy.buzz",
      "https://amazon-book-review.vercel.app",
      "http://amazon-book-review.vercel.app",
      "https://booksy.buzz",
      "*",
    ],
    credentials: true,
  })
);
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
    credentials: true, // Allow credentials if needed
  },
});
const messages: any = [];

const userSockets = new Map(); // Map to manage userId -> Set of socket IDs

io.on("connection", async (socket) => {
  // Send all users to the connected client
  socket.emit("get_users", await chatService.getAllUsers());

  // Listen for "join" events to associate users with their roles
  socket.on("join", async (data) => {
    const { userId, role } = data;

    const roomId=`Admin-${userId}`
    socket.join(roomId);

    socket.data.roomId = roomId;

    // console.log(`User joined: ${userId}, Role: ${role}`);

    // Attach user-specific data to the socket
    socket.data.userId = userId;
    socket.data.role = role;

    // Fetch previous chat messages from the database
    const preChat = await chatService.getChat({ userId, role });

    // Send all previous messages to the connected user
    socket.emit("receive_message", preChat);
  });

  // Ensure no duplicate listeners
  socket.removeAllListeners("send_message");

  // Listen for "send_message" events from this client
  socket.on("send_message", async (messageData) => {
    try {

      const roomId = socket.data.roomId;
      // Save the new message to the database
      const savedMessage = await chatService.chatInsertIntoDB(messageData);
// console.log(savedMessage)
      // // Broadcast the new message to all connected clients
      // io.emit(
      //   "receive_message",
      //   await chatService.getChat({
      //     userId: socket.data.userId,
      //     role: socket.data.role,
      //   })
      // );


      io.to(roomId).emit("receive_message", await chatService.getChat({ userId:socket.data.userId, role:socket.data.role }));
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error_message", "Failed to send message. Please try again.");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// io.on("connection", async(socket) => {

//   socket.emit("get_users", await chatService.getAllUsers())

//   // Listen for "join" events to associate users with their roles
//   socket.on("join", async (data) => {

//     const { userId, role } = data;

//     console.log(`User joined: ${userId}, Role: ${role}`);

//     // Attach user-specific data to the socket
//     socket.data.userId = userId;
//     socket.data.role = role;

//     // Fetch previous chat messages from the database
//     const preChat = await chatService.getChat({ userId, role });

//     // Send all previous messages to the connected user
//     socket.emit("receive_message", preChat);

//     // Listen for "send_message" events from this client
//     socket.on("send_message", async (messageData) => {

//       await chatService.chatInsertIntoDB(messageData);

//       // Broadcast the new message to all connected clients
//       io.emit("receive_message", await chatService.getChat({ userId, role }));
//     });
//   });

//   socket.on("disconnect", () => {

//   });
// });

// application routes

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi Developer !");
});
// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static("public"));

cron.schedule("*/1 * * * *", async () => {
  try {
    const result = await deleteUnverifiedUsers();

    return;
  } catch (error: any) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, error.message);
  }
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default server;
