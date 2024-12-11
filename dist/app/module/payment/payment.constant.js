"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.plans = void 0;
exports.plans = {
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
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["ACTIVE"] = "ACTIVE";
    PaymentStatus["EXPIRED"] = "EXPIRED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
