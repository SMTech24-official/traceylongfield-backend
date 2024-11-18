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
router.get("/book/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getSingleBook);
//approved book 
router.put("/approve/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.approveBook);
//rejected book
router.put("/reject/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.rejectBook);
// get all review
router.get("/review/all", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getAllReview);
// get single review
router.get("/single-review/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getSingleReview);
// approved review
router.put("/review/approve/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.approvedReview);
// rejected review
router.delete("/review/rejected/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.rejectReview);
// get all users
router.get("/users/get-all", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getAllUsers);
// get single user
router.get("/single-user/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getSingleUser);
// get all book based users with query parameters
router.get("/books/get-all/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), admin_controller_1.adminController.getAllBookBasedUsers);
exports.AdminRouters = router;
