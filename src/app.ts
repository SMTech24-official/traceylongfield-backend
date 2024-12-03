import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cron from "node-cron";
import path from "path";
import { checkExpiredSubscriptions } from "./app/module/payment/payment.services";
import { deleteUnverifiedUsers } from "./app/utils/deleteUnverifiedUser";
import AppError from "./app/errors/AppError";
import httpStatus from "http-status";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://celebrated-kitten-1b6ccf.netlify.app",
      "http://localhost:3000", // only one instance of localhost
      "https://amz-book-review.vercel.app",
      "https://api.booksy.buzz",
      "https://amazon-book-review.vercel.app", // Only if you're directly interacting with Stripe API from your frontend
      "http://amazon-book-review.vercel.app", 
      "https://booksy.buzz"// Only if you're directly interacting with Stripe API from your frontend
    ],
    credentials: true,
  })
);

// application routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi Developer !");
});
// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static("public"));
cron.schedule("0 0 * * *", async () => {
  try {
    await checkExpiredSubscriptions();
  } catch (error: any) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, error.message);
  }
});

cron.schedule("*/1 * * * *", async () => {
  try {
    const result = await deleteUnverifiedUsers();

    return;
  } catch (error: any) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, error.message);
  }
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
