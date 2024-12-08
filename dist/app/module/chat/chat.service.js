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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const user_model_1 = require("../users/user.model");
const chat_model_1 = require("./chat.model");
const chatInsertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Example service logic for creating or fetching data
    const data = yield chat_model_1.Chat.create(payload);
    return data;
});
const getChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const chatUser = yield chat_model_1.Chat.find({ senderId: data.userId });
    return chatUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_model_1.Chat.aggregate([
        {
            $sort: { createdAt: -1 }, // Sort by createdAt in descending order to get the latest message
        },
        {
            $group: {
                _id: "$senderId", // Group by senderId
                lastMessage: { $first: "$$ROOT" }, // Get the latest message
            },
        },
        {
            $sort: { "lastMessage.createdAt": -1 }, // Sort by the creation date of the last message
        },
    ]);
    // Map the result to get only the senderIds
    const userIds = result.map(user => user._id);
    // Fetch the users who sent the last messages
    const users = yield user_model_1.User.find({
        _id: { $in: userIds }, // Use $in to match any of the provided IDs
    });
    return users;
});
exports.chatService = {
    chatInsertIntoDB,
    getChat,
    getAllUsers,
};
