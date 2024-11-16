import * as argon2 from "argon2";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { Book } from "../book/book.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAdmin = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  payload.role = "admin";
  payload.isVerified = true;
  const result = await User.create(payload);

  const { password, ...rest } = result.toObject();
  return rest;
};

const getAllPendingBook = async () => {
  const result = await Book.find({ status: "pending" });
  return result;
};
// get single pending book 

const getSingleBook = async (id: string) => {
  const result:any = await Book.findById(id).populate("userId","-password");
   if(!result){
    throw new AppError(httpStatus.NOT_FOUND,"book not found")
   }
    result.user = result.userId; // Rename userId to user
            // Delete the original userId field
 
  return result;
};
export const adminServices = {
  getAllPendingBook,
  createAdmin,
  getSingleBook
};
