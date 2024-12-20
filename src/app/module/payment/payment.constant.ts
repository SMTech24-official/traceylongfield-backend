export const plans = {

    "monthly": {
      priceId: "price_1QU25bFGNtvHx4Utk1dhBg8J",
      duration: 30,
      price: 20,
    },
    "yearly": {
      priceId: "price_1QQ6P6FGNtvHx4UtSVWuqNRG",
      duration: 365,
      price: 200,
    }, // Most popular plan
  };

  export enum PaymentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
  }