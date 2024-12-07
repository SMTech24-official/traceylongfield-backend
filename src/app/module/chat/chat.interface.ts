export interface IChat {
 
    senderId: string;
    receiverId?:string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
}
