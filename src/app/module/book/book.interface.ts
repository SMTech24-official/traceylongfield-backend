import { Types } from "mongoose";


export interface IAddBook{
    title: string;
    userId:Types.ObjectId
    authorName: string;
    amazonBookUrl: string;
    bookFormate:string;
    bookCover:string;
    bookPdf?:string;
    genre:string;
    status:"pending"|"live",
    isReadyForReview:boolean;
    bookType:string;
    points:number;
   // wordCount:number;
    createdAt: Date;
    updatedAt: Date;


}