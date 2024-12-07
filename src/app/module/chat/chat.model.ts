import mongoose, { Schema, Document } from 'mongoose';
import { IChat } from './chat.interface';

// Define the schema
const ChatSchema: Schema = new Schema(
  {
    senderId: { type: String, },
    receiverId: { type: String},
    message: { type: String},
    role: { type: String },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Create and export the model
export const Chat = mongoose.model<IChat>('Chat', ChatSchema);


