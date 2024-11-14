export const USER_ROLE = {
    admin: "admin",
    user: "user",
    superAdmin:"superAdmin"
} as const;

export type TUserRole = keyof typeof USER_ROLE;
export const UserStatus = ['in-progress', 'blocked'];