import mongoose, { Schema } from "mongoose";
import { IQuestion } from "./question.interface";

// Create the schema for a Question
const QuestionSchema: Schema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true, 
      trim: true,
    },

    

  },
  {
    timestamps: true,
  }
);

// Create and export the Question model
export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);