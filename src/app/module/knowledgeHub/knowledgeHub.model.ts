import { model, Schema } from "mongoose";
import { IVideo } from "./knowledgeHub.interface";

const VideoSchema=new Schema<IVideo>({
    videoUrl: { type: String, required: true },
},{timestamps:true})

export const Video = model<IVideo>("Video", VideoSchema);


