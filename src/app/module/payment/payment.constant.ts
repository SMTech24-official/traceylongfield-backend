export const plans = {

    "monthly": {
      priceId: "prod_RFCODp2psTimKU",
      duration: 30,
      price: 20,
    },
    "yearly": {
      priceId: "prod_RFCQXAgKzWOOYR",
      duration: 365,
      price: 200,
    }, // Most popular plan
  };

  export enum PaymentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
  }