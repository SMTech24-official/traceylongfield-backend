import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import * as argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import config from "../../config";

const createUser = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  const result = await User.create(payload)
if(!result){
  throw new AppError (httpStatus.NOT_ACCEPTABLE,"User create failed")
}
  const resetUILink = `${config.activeLink}?id=${result._id}`
  // const resetUILink = `<button onclick=()=>(console.l)>Active account</button>`
  await sendEmail(payload.email, `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear</p>
          <p>You Need to active your Account:</p>
          <a href="${resetUILink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              active account
            </button>
          </a>
          <p>Thank you,<br>Dream 2 Drive</p>
          </div>

      `);


  const { password, ...rest } = result.toObject()
  return rest

}
const createAdmin = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  payload.role = "admin"
  const result = await User.create(payload)
  if (result) {
    const resetUILink = `${config.activeLink}?id=${result._id}`
    // const resetUILink = `<button onclick=()=>(console.l)>Active account</button>`
    sendEmail(payload.email, `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear</p>
          <p>You Need to active your Account:</p>
          <a href="${resetUILink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              active account
            </button>
          </a>
          <p>Thank you,<br>Dream 2 Drive</p>
          </div>

      `);
  }
  const { password, ...rest } = result.toObject()
  return rest

}
const activeAccount = async (id: any) => {
  const user = await User.findOne({ _id: id })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found")
  }
  if (user?.isActive) {
    throw new AppError(httpStatus.CONFLICT, "You account is already actived")
  }
  await User.findOneAndUpdate({ _id: id }, { isActive: true })
  return { message: "Your account active successfully" };
}
  ;
export const userServices = {
  createUser,
  activeAccount,
  createAdmin
};
