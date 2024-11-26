import { model, Schema } from "mongoose";
import { IPoints } from "./points.interface";

const pointsSchema=new Schema<IPoints>({
    type:{type:String,required:true,unique:true},
    points:{type:Number,required:true}
},{timestamps:true})

export const Point=model<IPoints>("Point",pointsSchema);