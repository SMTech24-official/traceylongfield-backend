import config from "../config";

import  nodemailer from "nodemailer"
import AppError from "../errors/AppError";
import httpStatus from "http-status";

export const sendEmail = async (to: string, html: string,subject:string) => {
 try {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>   
      user:" booksy.buzz@gmail.com",
      pass: "ffeg afpm suct jgfv",
    },
  });

   await transporter.sendMail({
    from: 'booksy.buzz@gmail.com', // sender address
    to, // list of receivers
    subject, // Subject line
    text: '', // plain text body
    html, // html body
  });
  
 } catch (error:any) {
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,error.message)
 }

};