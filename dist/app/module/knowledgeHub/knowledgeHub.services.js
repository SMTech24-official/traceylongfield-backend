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
exports.knowledgeHubService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const knowledgeHub_model_1 = require("./knowledgeHub.model");
const addKnowledgeHubVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.videoUrl) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "invalid input");
    }
    const haveVideo = yield knowledgeHub_model_1.Video.find();
    if (haveVideo.length > 0) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Video already exist");
    }
    const addVideo = yield knowledgeHub_model_1.Video.create(payload);
    return addVideo;
});
// delete video
const deleteKnowledgeHubVideo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const haveVideo = yield knowledgeHub_model_1.Video.find();
    if (haveVideo.length === 0) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Video not found");
    }
    const deleteVideo = yield knowledgeHub_model_1.Video.deleteMany();
    if (!deleteVideo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Video not found");
    }
    return deleteVideo;
});
// get video
const getKnowledgeHubVideo = () => __awaiter(void 0, void 0, void 0, function* () {
    const haveVideo = yield knowledgeHub_model_1.Video.find();
    if (haveVideo.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Video not found");
    }
    return haveVideo[0];
});
//update video
const updateKnowledgeHubVideo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const haveVideo = yield knowledgeHub_model_1.Video.findById(id);
    if (!haveVideo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Video not found");
    }
    if (!payload.videoUrl) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "invalid input");
    }
    const updateVideo = yield knowledgeHub_model_1.Video.findByIdAndUpdate(id, payload, { new: true });
    return updateVideo;
});
exports.knowledgeHubService = {
    addKnowledgeHubVideo,
    deleteKnowledgeHubVideo,
    updateKnowledgeHubVideo,
    getKnowledgeHubVideo
};
