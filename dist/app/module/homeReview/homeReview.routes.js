"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeReviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const homeReview_controller_1 = require("./homeReview.controller");
const fileUpload_1 = require("../../helpers/fileUpload");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUpload_1.fileUploader.uploadSingle, homeReview_controller_1.homeReviewController.homeReviewInsertInDB);
router.get('/', homeReview_controller_1.homeReviewController.getAllHomeReviews);
router.get('/:id', homeReview_controller_1.homeReviewController.getHomeReviewById);
router.patch('/:id', (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUpload_1.fileUploader.uploadSingle, homeReview_controller_1.homeReviewController.updateHomeReview);
router.delete('/:id', (0, auth_1.default)(constant_1.USER_ROLE.admin), homeReview_controller_1.homeReviewController.deleteHomeReview);
// Add other routes like PUT, DELETE etc.
exports.HomeReviewRouter = router;
