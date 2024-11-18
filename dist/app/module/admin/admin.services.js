"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const argon2 = __importStar(require("argon2"));
const user_model_1 = require("../users/user.model");
const book_model_1 = require("../book/book.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const activity_model_1 = require("../activity/activity.model");
const mongoose_1 = require("mongoose");
const reading_model_1 = require("../reading/reading.model");
const points_model_1 = require("../points/points.model");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield argon2.hash(payload.password);
    payload.role = "admin";
    payload.isVerified = true;
    const result = yield user_model_1.User.create(payload);
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const getAllPendingBook = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.find({ status: "pending" });
    return result;
});
// get single pending book
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id).populate("userId", "-password");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "book not found");
    }
    result.user = result.userId; // Rename userId to user
    // Delete the original userId field
    return result;
});
// approved Book
const approveBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const existingBook = yield book_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
        }
        if (existingBook.status === "live") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This book is already live");
        }
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, { status: "live" }, { new: true, session });
        if (!book) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to approve book");
        }
        if (book.status === "live") {
            yield activity_model_1.Notification.create([
                {
                    user: book.userId,
                    message: `Your book "${book.title}" has been approved`,
                },
            ], { session });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return book;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to approve book");
    }
});
// rejected Book
const rejectBook = (bookId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const existingBook = yield book_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
        }
        if (existingBook.status === "live") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This book is already live");
        }
        const deleteBook = yield book_model_1.Book.deleteOne(existingBook._id);
        if (deleteBook.deletedCount) {
            yield activity_model_1.Notification.create([
                {
                    user: existingBook.userId,
                    message: `Your book "${existingBook.title}" has been denied because ${reason}`,
                },
            ], { session });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deleteBook;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to approve book");
    }
});
// get all review
const getAllReview = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reading_model_1.ReadingBook.find({
        readingStatus: "finished",
        isApproved: false,
    })
        .populate("userId", "-password")
        .populate("bookId");
    return result;
});
// get single review
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getSingleReview");
    const result = yield reading_model_1.ReadingBook.findById(id)
        .populate("userId", "-password")
        .populate("bookId");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "review not found");
    }
    return result;
});
// approved review
const approvedReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const review = yield reading_model_1.ReadingBook.findById(id);
        if (!review) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
        }
        if (review.isApproved) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This review is already approved");
        }
        const reviewUser = yield user_model_1.User.findById(review.userId);
        if (!reviewUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        const reviewBook = yield book_model_1.Book.findById(review.bookId);
        if (!reviewBook) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
        }
        const reviewPoints = yield points_model_1.Point.findOne({ type: reviewBook.bookType });
        if (!reviewPoints) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Points not found");
        }
        const updateUserPoints = yield user_model_1.User.findByIdAndUpdate(reviewUser._id, { points: reviewPoints.points }, { new: true, session });
        const updateReview = yield reading_model_1.ReadingBook.findByIdAndUpdate(id, { isApproved: true }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return updateReview;
    }
    catch (error) {
        if (error) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, error.message);
        }
        yield session.abortTransaction();
        yield session.endSession();
    }
});
// reject review
const rejectReview = (id, reason) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, reason);
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const review = yield reading_model_1.ReadingBook.findById(id);
        if (!review) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
        }
        if (review.isApproved) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This review is already approved");
        }
        const deleteReview = yield reading_model_1.ReadingBook.deleteOne({ _id: review.id }, { session });
        if (deleteReview.deletedCount) {
            yield activity_model_1.Notification.create([
                {
                    user: review.userId,
                    message: `Your review  has been denied because ${reason}`,
                },
            ], { session });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deleteReview;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
// get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find().select('-password -otp -otpExpires');
    return users;
});
// get single user
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password -otp -otpExpires");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
// get all book based users with query parameters
const getAllBookBasedUsers = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log(id);
    const baseQuery = {};
    if (query.status) {
        baseQuery.status = query.status;
    }
    console.log(baseQuery);
    const result = yield book_model_1.Book.find(Object.assign({ userId: id }, baseQuery))
        .skip(skip)
        .limit(limit);
    //.populate("userId", "-password")
    return result;
});
// get single book
// const getSingleBook = async (id: string) => {
//   const book = await Book.findById(id);
//   if (!book) {
//     throw new AppError(httpStatus.NOT_FOUND, "Book not found");
//   }
//   return book;
// };
exports.adminServices = {
    getAllPendingBook,
    createAdmin,
    getSingleBook,
    approveBook,
    rejectBook,
    getAllReview,
    getSingleReview,
    approvedReview,
    rejectReview,
    getAllUsers,
    getSingleUser,
    getAllBookBasedUsers
};
