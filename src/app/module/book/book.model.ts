import { model, Schema } from "mongoose";
import { IAddBook } from "./book.interface";

// Define the schema
const BookSchema: Schema = new Schema<IAddBook>(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    userId:{ type:Schema.Types.ObjectId,ref:"User",required: true },
    amazonBookUrl: { type: String, required: true }, // Optional field
    bookReader: { type: String, required: true },
    bookCover: { type: String, required: true },
    bookPdf: { type: String, required: true },
    status:{type:String,enum:["pending", "live"] },
    genre: { type: String, required: true },
    bookType: { type: String, required: true },
    wordCount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create the model
export const Book = model<IAddBook>("Book", BookSchema);
