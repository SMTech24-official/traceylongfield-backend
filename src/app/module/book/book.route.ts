import express, { Router } from 'express'
import { bookController } from './book.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../../utils/constant'
import { fileUploader } from '../../helpers/fileUpload'
const router= express.Router()

router.post("/add-book",auth(USER_ROLE.author,USER_ROLE.admin), fileUploader.uploadMultiple, bookController.insertBookIntoDB)
router.get("/",auth(USER_ROLE.author),  bookController.getAllMyBooks)
router.get("/library",auth(USER_ROLE.author),  bookController.getAllBooks)
router.put("/get-reviewed/:id",auth(USER_ROLE.author), bookController.getReviewedBooks)





export const bookRoutes =router