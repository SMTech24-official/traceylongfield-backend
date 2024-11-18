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
const config_1 = __importDefault(require("../../config"));
const authorGuide_model_1 = require("./authorGuide.model");
const addAuthorGuide = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || !files.cover || !files.pdfFile) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "File is required for  add guide");
    }
    const cover = files.cover.map((file) => ({
        fileName: file === null || file === void 0 ? void 0 : file.filename,
        url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
    }));
    const pdfFile = files.pdfFile.map((file) => ({
        fileName: file === null || file === void 0 ? void 0 : file.filename,
        url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
    }));
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
    const payload = Object.assign(Object.assign({}, Data), { cover: cover[0].url, pdfFile: pdfFile[0].url });
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
    var _a, _b;
    const id = req.params.id;
    const files = req.files;
    let cover;
    let pdfFile;
    if (files.cover) {
        cover = (_a = files === null || files === void 0 ? void 0 : files.cover) === null || _a === void 0 ? void 0 : _a.map((file) => ({
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
        }));
    }
    if (files.pdfFile) {
        pdfFile = (_b = files === null || files === void 0 ? void 0 : files.pdfFile) === null || _b === void 0 ? void 0 : _b.map((file) => ({
            fileName: file === null || file === void 0 ? void 0 : file.filename,
            url: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}`,
        }));
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
        updateDoc.cover = cover[0].url;
    }
    if (pdfFile) {
        updateDoc.pdfFile = pdfFile[0].url;
    }
    console.log(id, updateDoc);
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
