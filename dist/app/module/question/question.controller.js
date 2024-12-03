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
exports.questionController = exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const question_service_1 = require("./question.service");
// Create a new Question
exports.createQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const question = yield question_service_1.questionService.createQuestion(data);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Question created successfully",
        data: question,
    });
}));
// Get all Questions
exports.getQuestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield question_service_1.questionService.getQuestions();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Questions retrieved successfully",
        data: questions,
    });
}));
// Get a Question by ID
exports.getQuestionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const question = yield question_service_1.questionService.getQuestionById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Question retrieved successfully",
        data: question,
    });
}));
// Update a Question by ID
exports.updateQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const updatedQuestion = yield question_service_1.questionService.updateQuestion(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Question updated successfully",
        data: updatedQuestion,
    });
}));
// Delete a Question by ID
exports.deleteQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield question_service_1.questionService.deleteQuestion(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Question updated successfully",
        data: result,
    });
}));
exports.questionController = {
    createQuestion: exports.createQuestion,
    getQuestions: exports.getQuestions,
    getQuestionById: exports.getQuestionById,
    updateQuestion: exports.updateQuestion,
    deleteQuestion: exports.deleteQuestion,
};
