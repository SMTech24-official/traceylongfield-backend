import express from 'express';
import { couponController } from './coupon.controller';


const router = express.Router();

router.post('/', couponController.couponInsertInDB);
// Add other routes like PUT, DELETE etc.

export const couponRouter=router;
