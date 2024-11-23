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
const book_model_1 = require("./book.model");
const activity_model_1 = require("../activity/activity.model");
const fileUpload_1 = require("../../helpers/fileUpload");
const insertBookIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const files = req.files;
    if (!files || !files.bookCover || !files.bookPdf) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "File is required to add book");
    }
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
    // Helper function for uploading to Cloudinary
    const uploadFileToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield fileUpload_1.fileUploader.uploadToCloudinary(file);
            return result.secure_url; // Return the Cloudinary secure URL
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary");
        }
    });
    // Upload book cover and book PDF
    let bookCoverUrl, bookPdfUrl;
    try {
        bookCoverUrl = yield uploadFileToCloudinary(files.bookCover[0]);
        bookPdfUrl = yield uploadFileToCloudinary(files.bookPdf[0]);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "File upload error");
    }
    // Create book payload
    const payload = Object.assign(Object.assign({}, bookData), { userId: user.userId, status: "pending", bookCover: bookCoverUrl, bookPdf: bookPdfUrl });
    // Save book in the database
    let result;
    try {
        result = yield book_model_1.Book.create(payload);
        if (!result) {
            throw new Error("Failed to insert book into DB");
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
    // Send notification if book creation is successful
    try {
        yield activity_model_1.Notification.create({
            user: user.userId,
            message: `Your book "${bookData.title}" has been submitted for approval`,
        });
    }
    catch (error) {
        console.error("Failed to create notification:", error.message);
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
        const query = { userId: { $ne: user.userId }, status: "live", isReadyForReview: true };
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
//get for reviewed 
const getReviewedBooks = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(id);
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
    }
    if (book.status !== "live") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This book is not approved");
    }
    const result = yield book_model_1.Book.findByIdAndUpdate(id, { isReadyForReview: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update book status");
    }
    return result;
});
exports.bookService = {
    insertBookIntoDB,
    getAllMyBooks,
    getAllBooks,
    getReviewedBooks
};
