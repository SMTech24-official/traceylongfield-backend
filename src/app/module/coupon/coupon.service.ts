import config from '../../config';
import { coupon } from './coupon.model';
const stripe = require('stripe')(config.stripe_secret_key);

const couponInsertIntoDB =async() =>{

 // Step 1: Create a Product
 const product = await stripe.products.create({
  name: 'Pro Subscription',
  description: 'Access to premium features',
});


// Step 2: Create a Price for the Product
const price = await stripe.prices.create({
  unit_amount: 2000, // Price in cents ($20.00)
  currency: 'usd',
  recurring: { interval: 'month' }, // Monthly subscription
  product: product.id,
});


// Step 3: Create a Coupon
const coupon = await stripe.coupons.create({
  name: 'New Year Sale - 25% Off',
  percent_off: 25,
  duration: 'repeating',
  duration_in_months: 3, // Apply coupon for 3 months
});



// Step 4: Apply Coupon and Create Subscription
const customer = await stripe.customers.create({
  email: 'customer@example.com', // Replace with the customer's email
  name: 'John Doe',
});


// await stripe.paymentMethods.attach('pm_1QSBZrFGNtvHx4UtyI7lnedr', {
//   customer: customer.id,
// });
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: price.id }],
  discounts: [{ coupon: coupon.id }], // Apply the coupon
});


return {
  product,
  price,
  coupon,
  subscription,
};
};

export const couponService = {
 couponInsertIntoDB,
};
