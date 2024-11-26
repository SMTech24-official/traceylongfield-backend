
import { model, Schema } from "mongoose";
import { PaymentStatus } from "./payment.constant";
import { IPayment, IPaymentInformation } from './payment.interface';


// Define the Payment Schema
const PaymentSchema = new Schema<IPayment>({
    userEmail: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING 
    },
    paymentIntentId: { type: String, required: false },
    subscriptionId: { type: String, required: false },
    planType: { type: String, required: true },
    planDuration: { type: Number, required: true }, // duration in days
    currentPeriodEnd: { type: Date, required: true },
  }, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  });
  
  // Create and export the Payment model
  export const Payment = model<IPayment>('Payment', PaymentSchema);
  


  // Define the PaymentInformation Schema
const PaymentInformationSchema = new Schema<IPaymentInformation>({
    buyerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transactionId: { type: String, required: false },
    customerId: { type: String, required: true },
    planType: { type: String, required: true },
    planDuration: { type: Number, required: true },  // duration in days
    currentPeriodEnd: { type: Date, required: true },
  }, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  });
  
  // Create and export the PaymentInformation model
  export const PaymentInformation = model<IPaymentInformation>('PaymentInformation', PaymentInformationSchema);
  