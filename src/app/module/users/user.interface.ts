export interface IUser {
    id?: string;
    email: string;
    username: string;
    password: string;
    role: 'admin' | 'author'|"superAdmin";
    level: number;
    points: number;
    streak: number;
    avatar: string;
    isActive:boolean;
    invitedFriends: number;
    createdAt: Date;
    updatedAt: Date;
    termsAccepted?: boolean;
}


