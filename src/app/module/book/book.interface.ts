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
    bookType:string;
   // wordCount:number;
    createdAt: Date;
    updatedAt: Date;


}