"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorGuide = void 0;
const express_1 = require("express");
const authorguide_controller_1 = require("./authorguide.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const fileUpload_1 = require("../../helpers/fileUpload");
const router = (0, express_1.Router)();
router.post("/add-author-guide", (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUpload_1.fileUploader.uploadGuide, authorguide_controller_1.authorGuideController.addAuthorGuide);
// update author guide
router.get("/author-guide", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.author), authorguide_controller_1.authorGuideController.getAllAuthorGuides);
router.get("/author-guide/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.author), authorguide_controller_1.authorGuideController.getAuthorGuideById);
router.put("/update-author-guide/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUpload_1.fileUploader.uploadGuide, authorguide_controller_1.authorGuideController.updateAuthorGuide);
// delete author guide
router.delete("/delete-author-guide/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), authorguide_controller_1.authorGuideController.deleteAuthorGuide);
exports.AuthorGuide = router;
