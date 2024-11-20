import { Router } from "express";
import { paymentController } from "./payment.controller";



const router = Router();

// Route to create a new subscription
router.post("/subscribe", paymentController.createSubscription);
// Route to cancel a subscription
router.post("/cancel", paymentController.cancelSubscription);
// Route to get all payments (subscriptions) from the database
router.get("/payments", paymentController.getAllPayments);

// Route to update a payment by its ID

router.put("/payments/update", paymentController.updateSubscriptionPlan);
// Route to delete a payment by its ID
router.delete("/payments/:id", paymentController.deletePayment);

export const PaymentRoutes = router;