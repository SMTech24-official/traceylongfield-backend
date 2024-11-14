import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';


// Mongoose Schema
const userSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'author',"superAdmin"],
            default: 'author',
            required: true,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        points: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            default: 'default_avatar_url',
        },
        invitedFriends: {
            type: Number,
            default: 0,
        },
        termsAccepted: {
            type: Boolean,
            default: false,
            required: false,  // Optional field
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Export the model
export const User = mongoose.model<IUser>('User', userSchema);
