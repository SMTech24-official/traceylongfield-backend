export interface IUser {
    id?: string;
    fullName:string;
    reviewerName:string;
    amazonCountry:string;
    amazonAuthorPageLink:string;
    email: string;
    password: string;
    role: 'admin' | 'author'|"superAdmin";
    points: number;
    profileImage: string;
    isVerified:boolean;
    isSubscribed:boolean;
    plane:string;
    invitedFriends: number;
    createdAt: Date;
    updatedAt: Date;
    termsAccepted?: boolean;
}


