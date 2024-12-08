"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const deleteUnverifiedUser_1 = require("./app/utils/deleteUnverifiedUser");
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("./app/module/chat/chat.service");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
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
}));
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
        allowedHeaders: ["Content-Type"], // Specify allowed headers
        credentials: true, // Allow credentials if needed
    },
});
const messages = [];
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.emit("get_users", yield chat_service_1.chatService.getAllUsers());
    // Listen for "join" events to associate users with their roles
    socket.on("join", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, role } = data;
        console.log(`User joined: ${userId}, Role: ${role}`);
        // Attach user-specific data to the socket
        socket.data.userId = userId;
        socket.data.role = role;
        // Fetch previous chat messages from the database
        const preChat = yield chat_service_1.chatService.getChat({ userId, role });
        // Send all previous messages to the connected user
        socket.emit("receive_message", preChat);
        // Listen for "send_message" events from this client
        socket.on("send_message", (messageData) => __awaiter(void 0, void 0, void 0, function* () {
            // Save the message to the database
            yield chat_service_1.chatService.chatInsertIntoDB(messageData);
            // Broadcast the new message to all connected clients
            io.emit("receive_message", yield chat_service_1.chatService.getChat({ userId, role }));
        }));
    }));
    socket.on("disconnect", () => {
    });
}));
// application routes
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hi Developer !");
});
// Serve static files from the uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.use(express_1.default.static("public"));
node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, deleteUnverifiedUser_1.deleteUnverifiedUsers)();
        return;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, error.message);
    }
}));
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = server;
