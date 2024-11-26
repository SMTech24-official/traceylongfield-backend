import { model, Schema } from "mongoose";
import { INotification } from "./activity.interface";

// Mongoose schema
const NotificationSchema: Schema = new Schema(
    {
      user: { type: String, required: true }, // Reference to the user, e.g., user ID or username
      message: { type: String, required: true }, // Notification message
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  // Mongoose model
export const Notification = model<INotification>('Notification', NotificationSchema);