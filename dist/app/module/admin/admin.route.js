"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouters = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = (0, express_1.Router)();
router.post("/make-admin", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.createAdmin);
router.get("/", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getAllPendingBook);
exports.AdminRouters = router;
