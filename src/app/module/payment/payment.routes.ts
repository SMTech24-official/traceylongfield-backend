import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";



const router = Router();

router.post(
    "/create-subscription",
    paymentController.createSubscription
  );
  router.post(
    "/cancel-subscription",
    auth(USER_ROLE.author),
    paymentController.cancelSubscription
  );
  router.put(
    "/update-subscription",
    auth(USER_ROLE.author),
    paymentController.updateSubscription
  );




export const PaymentRoutes = router;