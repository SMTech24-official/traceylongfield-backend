export interface IUser {
    id?: string;
    fullName:string;
    reviewerName:string;
    amazonCountry:string;
    amazonAuthorPageLink:string;
    email: string;
    password: string;
   otp?: string;
    otpExpires?: Date;
    role: 'admin' | 'author'|"superAdmin";
    points?: number;
    profileImage?: string;
    isVerified:boolean;
    isSubscribed?:boolean;
    stripeCustomerId?:string;
    subscriptionPlane?:string;
    invitedFriends?: number;
    createdAt: Date;
    updatedAt: Date;
    termsAccepted?: boolean;
}


