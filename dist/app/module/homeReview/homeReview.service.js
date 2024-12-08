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
exports.homeReviewService = void 0;
const homeReview_model_1 = require("./homeReview.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUpload_1 = require("../../helpers/fileUpload");
// Create a new HomeReview
const createHomeReview = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // if(!req.file){
    //   throw new AppError(httpStatus.BAD_REQUEST, "Please upload a author image");
    // }
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request body");
    }
    const data = JSON.parse(req.body.data);
    let image;
    if (req.file) {
        image = yield fileUpload_1.fileUploader.uploadToDigitalOcean(req.file);
    }
    const homeReview = Object.assign({ image: (image === null || image === void 0 ? void 0 : image.Location) || "" }, data);
    const result = yield homeReview_model_1.HomeReview.create(homeReview);
    return result;
});
// Get all HomeReviews
const getAllHomeReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const homeReviews = yield homeReview_model_1.HomeReview.find();
    return homeReviews;
});
// Get a HomeReview by ID
const getHomeReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const homeReview = yield homeReview_model_1.HomeReview.findById(id);
    if (!homeReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "HomeReview not found");
    }
    return homeReview;
});
const updateHomeReview = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the request body and file upload
    const homeReview = yield homeReview_model_1.HomeReview.findById(id);
    // If the HomeReview does not exist, throw an error
    if (!homeReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "HomeReview not found");
    }
    let image = homeReview.image; // Keep the existing image if not updating
    // Check if a new image is uploaded, if so, upload it to DigitalOcean
    if (req.file) {
        image = (yield fileUpload_1.fileUploader.uploadToDigitalOcean(req.file)).Location;
    }
    // Parse and extract the new data from the request
    let data = req.body.data ? JSON.parse(req.body.data) : {};
    // Update the HomeReview fields with new values
    const updatedHomeReview = yield homeReview_model_1.HomeReview.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { image: image }), // Merge the new data and image
    { new: true, runValidators: true } // `new: true` returns the updated document
    );
    // If update fails, throw an error
    if (!updatedHomeReview) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error updating HomeReview");
    }
    return updatedHomeReview;
});
// Delete HomeReview by ID
const deleteHomeReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedHomeReview = yield homeReview_model_1.HomeReview.findByIdAndDelete(id);
    if (!deletedHomeReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "HomeReview not found");
    }
    return deletedHomeReview;
});
exports.homeReviewService = {
    createHomeReview,
    getAllHomeReviews,
    getHomeReviewById,
    updateHomeReview,
    deleteHomeReview,
};
