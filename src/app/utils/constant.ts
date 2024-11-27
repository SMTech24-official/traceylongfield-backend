export const USER_ROLE = {
    admin: "admin",
    author: "author",
    superAdmin:"superAdmin"
} as const;
export const Reading_status = {
    reading: "reading",
    finished: "finished",
    paused:"paused"
} as const;

export type TUserRole = keyof typeof USER_ROLE;
export const UserStatus = ['in-progress', 'blocked'];