"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRouter = void 0;
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("./question.controller");
const router = express_1.default.Router();
// Route to create a new question
router.post("/", question_controller_1.questionController.createQuestion);
// Route to get all questions
router.get("/", question_controller_1.questionController.getQuestions);
// Route to get a question by ID
router.get("/:id", question_controller_1.questionController.getQuestionById);
// Route to update a question by ID
router.put("/:id", question_controller_1.questionController.updateQuestion);
// Route to delete a question by ID
router.delete("/:id", question_controller_1.questionController.deleteQuestion);
exports.QuestionRouter = router;
