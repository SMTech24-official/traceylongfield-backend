"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.plans = void 0;
exports.plans = {
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
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["ACTIVE"] = "ACTIVE";
    PaymentStatus["EXPIRED"] = "EXPIRED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
