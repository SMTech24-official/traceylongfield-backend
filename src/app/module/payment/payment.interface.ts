import { Types } from "mongoose";
import { PaymentStatus } from "./payment.constant";



export interface CreatePaymentInput {
  price: number;
  paymentMethodId: string;
  userEmail: string;
  carsId: string;
  planType: "1 Month" | "1 year"; // PlanType is restricted to these values
  
}
// Define the Payment interface
export interface IPayment  {
  userEmail: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  subscriptionId?: string;
  planType: string; // '1 Week', '1 Month', '3 Months'
  planDuration: number; // duration in days (7, 30, 90)
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  user: Types.ObjectId;  // Reference to the User model
}

// Define the PaymentInformation interface
export interface IPaymentInformation {
  buyerEmail: string;
  amount: number;
  currency: string;
  transactionId?: string;
  customerId: string;
  planType: string;  // '1 Week', '1 Month', '3 Months'
  planDuration: number; // duration in days (7, 30, 90)
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  user: Types.ObjectId;  // Reference to the User model
}