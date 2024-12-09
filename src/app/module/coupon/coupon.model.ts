import mongoose, { Schema } from 'mongoose';
import { ICoupon } from './coupon.interface';


export const couponSchema: Schema = new Schema({
email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
},
// Add other fields here as per your requirements
}, {
timestamps: true, // Automatically adds createdAt and updatedAt
});

export const coupon = mongoose.model<ICoupon>('coupon', couponSchema);
