import express from 'express';
import { homeReviewController } from './homeReview.controller';
import { fileUploader } from '../../helpers/fileUpload';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../utils/constant';

const router = express.Router();

router.post('/',auth(USER_ROLE.admin),fileUploader.uploadSingle, homeReviewController.homeReviewInsertInDB);
router.get('/', homeReviewController.getAllHomeReviews);
router.get('/:id', homeReviewController.getHomeReviewById);
router.patch('/:id', auth(USER_ROLE.admin),fileUploader.uploadSingle, homeReviewController.updateHomeReview);
router.delete('/:id',auth(USER_ROLE.admin), homeReviewController.deleteHomeReview);
// Add other routes like PUT, DELETE etc.

export const HomeReviewRouter= router;
