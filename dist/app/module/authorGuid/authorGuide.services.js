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
exports.authorGuideService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const authorGuide_model_1 = require("./authorGuide.model");
const fileUpload_1 = require("../../helpers/fileUpload");
const addAuthorGuide = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || !files.cover || !files.pdfFile) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "File is required for  add guide");
    }
    const cover = yield fileUpload_1.fileUploader.uploadToDigitalOcean(files.cover[0]);
    const pdfFile = yield fileUpload_1.fileUploader.uploadToDigitalOcean(files.pdfFile[0]);
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request body");
    }
    let Data;
    try {
        Data = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON in request body");
    }
    const payload = Object.assign(Object.assign({}, Data), { cover: cover.Location, pdfFile: pdfFile.Location });
    const authorGuide = yield authorGuide_model_1.AuthorGuid.create(payload);
    return authorGuide;
});
// get all author guides
const getAllAuthorGuides = () => __awaiter(void 0, void 0, void 0, function* () {
    const authorGuides = yield authorGuide_model_1.AuthorGuid.find();
    return authorGuides;
});
// get single author guide
const getAuthorGuideById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const authorGuide = yield authorGuide_model_1.AuthorGuid.findById(id);
    if (!authorGuide) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Author guide not found");
    }
    return authorGuide;
});
// update author guide
const updateAuthorGuide = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const files = req.files;
    let cover;
    let pdfFile;
    if (files.cover) {
        cover = yield fileUpload_1.fileUploader.uploadToDigitalOcean(files.cover[0]);
    }
    if (files.pdfFile) {
        pdfFile = yield fileUpload_1.fileUploader.uploadToDigitalOcean(files.pdfFile[0]);
    }
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request body");
    }
    let Data;
    try {
        Data = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON in request body");
    }
    const updateDoc = {};
    if (Data.title) {
        updateDoc.title = Data.title;
    }
    if (Data.addedBy) {
        updateDoc.addedBy = Data.addedBy;
    }
    if (cover) {
        updateDoc.cover = cover.Location;
    }
    if (pdfFile) {
        updateDoc.pdfFile = pdfFile.Location;
    }
    const authorGuide = yield authorGuide_model_1.AuthorGuid.findByIdAndUpdate(id, updateDoc, {
        new: true,
    });
    return authorGuide;
});
// delete author guide 
const deleteAuthorGuide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const authorGuide = yield authorGuide_model_1.AuthorGuid.findByIdAndDelete(id);
    if (!authorGuide) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Author guide not found");
    }
    return authorGuide;
});
exports.authorGuideService = {
    addAuthorGuide,
    updateAuthorGuide,
    getAllAuthorGuides,
    getAuthorGuideById,
    deleteAuthorGuide,
};
