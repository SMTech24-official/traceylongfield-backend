export const plans = {

    "monthly": {
      priceId: "price_1QMhzxH9Y1hxdYk4ePy8m8Dz",
      duration: 30,
      price: 20,
    },
    "yearly": {
      priceId: "price_1QMi1iH9Y1hxdYk4EnqgJgp7",
      duration: 365,
      price: 200,
    }, // Most popular plan
  };

  export enum PaymentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
  }