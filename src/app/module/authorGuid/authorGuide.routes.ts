import { Router } from "express";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";
import { fileUploader } from "../../helpers/fileUpload";
import { authorGuideController } from "./authorGuide.controller";

const router=Router();

router.post("/add-author-guide",auth(USER_ROLE.admin),fileUploader.uploadGuide, authorGuideController.addAuthorGuide)
// update author guide

router.get("/author-guide", auth(USER_ROLE.admin, USER_ROLE.author), authorGuideController.getAllAuthorGuides)

router.get("/author-guide/:id", auth(USER_ROLE.admin, USER_ROLE.author), authorGuideController.getAuthorGuideById)

router.put("/update-author-guide/:id",auth(USER_ROLE.admin), fileUploader.uploadGuide, authorGuideController.updateAuthorGuide)
// delete author guide

router.delete("/delete-author-guide/:id",auth(USER_ROLE.admin), authorGuideController.deleteAuthorGuide)
export const AuthorGuide=router