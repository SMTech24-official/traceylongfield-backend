import mongoose, { Schema, Document } from "mongoose";
import { IHomeReview } from "./homeReview.interface";

const homeReviewSchema = new Schema<IHomeReview>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    socials: { type: [String], required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

export const HomeReview = mongoose.model<IHomeReview>(
  "HomeReview",
  homeReviewSchema
);
