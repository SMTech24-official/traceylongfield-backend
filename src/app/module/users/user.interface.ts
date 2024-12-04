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
    isPayment: boolean;
    customerId: string;
    stripeCustomerId: string;
    subscriptionId: string;
    priceId: string;
    subscriptionPlane?:string;
    invitedFriends?: number;
    createdAt: Date;
    updatedAt: Date;
    termsAccepted?: boolean;
}

export interface IAuthUser {
    userId: string
    name: string
    email: string
    role: string
    iat: number
    exp: number
  }


