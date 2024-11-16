"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const reading_controller_1 = require("./reading.controller");
const router = (0, express_1.Router)();
router.get("/to-be-reviewed", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.getToReviewedBook);
router.get("/review-overdue", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.getToReviewOverDueBook);
router.get("/review-finished", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.getCompleteReview);
router.post("/start-reading/:id", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.startReading);
router.patch("/finish-reading/:id", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.finishReading);
router.patch("/give-review/:id", (0, auth_1.default)(constant_1.USER_ROLE.author), reading_controller_1.readingController.completeReview);
exports.ReadingRouter = router;
