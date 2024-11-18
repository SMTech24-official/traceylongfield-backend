"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointRouter = void 0;
const express_1 = require("express");
const points_controller_1 = require("./points.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = (0, express_1.Router)();
router.post("/add-point", points_controller_1.pointController.addPointWithType);
// get all points list
router.get("/", points_controller_1.pointController.getAllPoints);
// get single point 
router.get("/:id", points_controller_1.pointController.getSinglePoint);
// update point 
router.patch("/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), points_controller_1.pointController.updatePoint);
// delete point
router.delete("/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin), points_controller_1.pointController.deletePoint);
exports.PointRouter = router;
