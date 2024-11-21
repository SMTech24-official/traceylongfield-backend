

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { USER_ROLE } from '../../utils/constant';
import auth from '../../middlewares/auth';


const router = express.Router();

router.post(
  '/login',
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.author),
  
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',

  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',

  AuthControllers.resetPassword,
);

// resend OTP

router.post(
  '/resend-otp',
  AuthControllers.resendOtp,
);
export const AuthRoutes = router;

