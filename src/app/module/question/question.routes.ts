import express from "express";
import { questionController } from "./question.controller";


const router = express.Router();

// Route to create a new question
router.post("/", questionController.createQuestion);

// Route to get all questions
router.get("/", questionController.getQuestions);

// Route to get a question by ID
router.get("/:id", questionController.getQuestionById);

// Route to update a question by ID
router.put("/:id", questionController.updateQuestion);

// Route to delete a question by ID
router.delete("/:id", questionController.deleteQuestion);

export const QuestionRouter=router;
