"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const fileUpload_1 = require("../../helpers/fileUpload");
const router = express_1.default.Router();
router.post("/add-book", (0, auth_1.default)(constant_1.USER_ROLE.author), fileUpload_1.fileUploader.uploadMultiple, book_controller_1.bookController.insertBookIntoDB);
router.get("/", (0, auth_1.default)(constant_1.USER_ROLE.author), book_controller_1.bookController.getAllMyBooks);
router.get("/library", (0, auth_1.default)(constant_1.USER_ROLE.author), book_controller_1.bookController.getAllBooks);
exports.bookRoutes = router;
