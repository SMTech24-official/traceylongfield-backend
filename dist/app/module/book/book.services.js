"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const book_model_1 = require("./book.model");
const insertBookIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const files = req.files;
    console.log(files.bookReader);
    if (!files || !files.bookReader || !files.bookCover || !files.bookPdf) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "File is required for  add book");
    }
    const bookCover = files.bookCover.map((file) => ({
        fileName: file === null || file === void 0 ? void 0 : file.filename,
        url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
    }));
    const bookPdf = files.bookPdf.map((file) => ({
        fileName: file === null || file === void 0 ? void 0 : file.filename,
        url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
    }));
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request body");
    }
    let bookData;
    try {
        bookData = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON in request body");
    }
    const payload = Object.assign(Object.assign({}, bookData), { userId: user.userId, status: "pending", bookCover: bookCover[0].url, bookPdf: bookPdf[0].url });
    const result = yield book_model_1.Book.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to insert book into DB");
    }
    return result;
});
// get all book with pagination and query by status
const getAllMyBooks = (page, limit, status, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { userId: user.userId };
        if (status) {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
            ; // Ensure proper assignment to query
        }
        const books = yield book_model_1.Book.find(query)
            .populate('userId') // Assuming 'userId' is the field in your schema
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit) // Pagination: skip documents for previous pages
            .limit(limit); // Limit the number of results per page
        if (!books) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get books");
        }
        return books;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
    }
});
const getAllBooks = (page, limit, user, genre) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { userId: { $ne: user.userId }, status: "live" };
        if (genre) {
            query.genre = { $regex: new RegExp(`^${genre}$`, 'i') }; // Case-insensitive exact match
        }
        const books = yield book_model_1.Book.find(query)
            .populate('userId') // Assuming 'userId' is the field in your schema
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit) // Pagination: skip documents for previous pages
            .limit(limit); // Limit the number of results per page
        if (!books) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get books");
        }
        return books;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
    }
});
exports.bookService = {
    insertBookIntoDB,
    getAllMyBooks,
    getAllBooks,
};