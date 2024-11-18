import { model, Schema } from "mongoose";
import { IAuthorGuid } from "./authorGuide.interface";


const AuthorGuidSchema: Schema<IAuthorGuid> = new Schema({
    cover: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    pdfFile: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
 export const AuthorGuid = model<IAuthorGuid>('AuthorGuid', AuthorGuidSchema);