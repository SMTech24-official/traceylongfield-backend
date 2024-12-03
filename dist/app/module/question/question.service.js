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
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionService = void 0;
const question_model_1 = require("./question.model");
// Create a new Question
const createQuestion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield question_model_1.Question.create(data);
});
// Get all Questions
const getQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield question_model_1.Question.find();
});
const getQuestionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield question_model_1.Question.findById(id);
    if (!question) {
        throw new Error("Question not found");
    }
    return question;
});
// Update a Question by ID
const updateQuestion = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield question_model_1.Question.findById(id);
    if (!question) {
        throw new Error("Question not found");
    }
    const updatedQuestion = yield question_model_1.Question.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!updatedQuestion) {
        throw new Error("Question not found");
    }
    return updatedQuestion;
});
// Delete a Question by ID
const deleteQuestion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield question_model_1.Question.findById(id);
    if (!question) {
        throw new Error("Question not found");
    }
    const deletedQuestion = yield question_model_1.Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
        throw new Error("Question not found");
    }
});
exports.questionService = {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
};
