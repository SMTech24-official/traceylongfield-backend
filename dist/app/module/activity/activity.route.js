"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRouter = void 0;
const express_1 = require("express");
const activity_controller_1 = require("./activity.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = (0, express_1.Router)();
router.get('/get-all', (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.author, constant_1.USER_ROLE.superAdmin), activity_controller_1.activityController.getAllMyNotifications);
exports.activityRouter = router;
