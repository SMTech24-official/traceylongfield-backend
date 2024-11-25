import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { User } from "../module/users/user.model";

export const deleteUnverifiedUsers = async () => {
  // delete unverified users check that their OtpExpires date
  try {
    const user = await User.find({
      otpExpires: { $lt: new Date() },
      isVerified: false,
    });
    if (user.length > 0) {
      const deleteCount = await User.deleteMany({
        otpExpires: { $lt: new Date() },
        isVerified: false,
      });
    }
    return
  } catch (error: any) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, error.message);
  }
};
