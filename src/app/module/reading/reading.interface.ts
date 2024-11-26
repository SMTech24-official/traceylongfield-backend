import { Types } from "mongoose";

export interface IReadingBook {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  readingStatus: "reading" | "finished" | "paused";
  isApproved:boolean;
}

