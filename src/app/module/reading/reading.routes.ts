import  { Router } from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../../utils/constant'
import { readingController } from './reading.controller'
const router=Router()


router.get("/to-be-reviewed",auth(USER_ROLE.author),  readingController.getToReviewedBook)
router.get("/review-overdue",auth(USER_ROLE.author),  readingController.getToReviewOverDueBook)
router.get("/review-finished",auth(USER_ROLE.author),  readingController.getCompleteReview)
router.post("/start-reading/:id",auth(USER_ROLE.author),  readingController.startReading)
router.patch("/finish-reading/:id",auth(USER_ROLE.author),  readingController.finishReading)
router.patch("/give-review/:id",auth(USER_ROLE.author),  readingController.completeReview)

export const ReadingRouter=router