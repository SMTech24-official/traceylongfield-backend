import { User } from "../users/user.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";

const chatInsertIntoDB = async (payload: IChat) => {
  // Example service logic for creating or fetching data
  // console.log("1st")
  const data = await Chat.create(payload);
  return data;
};

const getChat = async (data: any) => {
  // console.log("2nd")
  const chatUser = await Chat.find({ senderId: data.userId });
  return chatUser;
};

const getAllUsers = async () => {
  const result = await Chat.aggregate([
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
  const users = await User.find({
    _id: { $in: userIds }, // Use $in to match any of the provided IDs
  });



  return users;
};

export const chatService = {
  chatInsertIntoDB,
  getChat,
  getAllUsers,
};
