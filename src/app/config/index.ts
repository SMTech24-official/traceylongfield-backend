import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default{
    port:process.env.PORT,
    dataBaseUrl:process.env.DATABASE_URL,
    nodeEnv:process.env.NODE_ENV,
    activeLink:process.env.ACTIVE_ACCOUNT_UI_LINK,
    jwt_access_secret:process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN,
    mail:process.env.MAIL,
    mail_pass:process.env.MAIL_PASS
}