import { model, Schema } from "mongoose";
import { IReadingBook } from "./reading.interface";

// Define the schema
const ReadingBookSchema = new Schema<IReadingBook>(
    {
      bookId: { type: Schema.Types.ObjectId, required: true, ref: "Book" },
      userId: { type:  Schema.Types.ObjectId, required: true, ref: "User" },
      readingStatus: {
        type: String,
        enum: ["reading", "finished", "paused"],
        required: true,
      },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
  );
  
  // Create and export the model
  export const ReadingBook = model<IReadingBook>("ReadingBook", ReadingBookSchema);
  