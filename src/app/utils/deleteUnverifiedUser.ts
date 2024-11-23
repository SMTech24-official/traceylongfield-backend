import { User } from "../module/users/user.model";

export const deleteUnverifiedUsers=async()=>{
   // delete unverified users check that their OtpExpires date 
   try {
    const deleteCount = await User.deleteMany({ otpExpires: { $lt: new Date() },isVerified: false  });
    console.log(`${deleteCount.deletedCount} expired OTP records were deleted.`);
} catch (error) {
    console.error("Error deleting expired OTPs:", error);
}
  
   
}