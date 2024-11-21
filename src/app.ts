import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cron from "node-cron";
import { checkExpiredSubscriptions } from './app/module/payment/payment.services';
import { deleteUnverifiedUsers } from './app/utils/deleteUnverifiedUser';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: ['https://celebrated-kitten-1b6ccf.netlify.app',"http://localhost:3000","https://amz-book-review.vercel.app"], credentials: true }));

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi Developer !');
});

cron.schedule("0 0 * * *", async () => {
  try {
    await checkExpiredSubscriptions();
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
  }
});cron.schedule("*/1 * * * *", async () => {
  try {
    await deleteUnverifiedUsers();
    console.log("Checked and deleted unverified users successfully.");
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
});


app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;