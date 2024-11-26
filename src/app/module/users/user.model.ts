import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

// Define the schema for the User model
const userSchema: Schema = new Schema<IUser>({
  fullName: { type: String, required: true },
  reviewerName: { type: String, required: true },
  amazonCountry: { type: String, required: true },
  amazonAuthorPageLink: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "author", "superAdmin"],
    required: true,
  },
  points: { type: Number, default: 0 },
  profileImage: { type: String },
  otp: { type: Number },
  stripeCustomerId: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlane: { type: String, default: "" },
  invitedFriends: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  termsAccepted: { type: Boolean, default: false },
});

// Create the User model using the schema
export const User = model<IUser>("User", userSchema);

 // Adjust the path if needed

User.watch([{ $match: { 'operationType': 'update' } }])  // Watch for update operations
  .on("change", async (change) => {
    try {
      // Check if the change includes the 'invitedFriends' field update
      if (change.updateDescription.updatedFields.invitedFriends) {
        const userId = change.documentKey._id;
        const user = await User.findById(userId);

        if (user) {
          let point = 0;
          if (user.invitedFriends === 10) {
            point = 100;
          } else if (user.invitedFriends === 20) {
            point = 200;
          }

          // If points are assigned, update and save the user document
          if (point > 0) {
            user.points = (user.points || 0) + point;
            await user.save();
          }
        }
      }
    } catch (error) {
      console.error("Error processing change:", error);
    }
  });

