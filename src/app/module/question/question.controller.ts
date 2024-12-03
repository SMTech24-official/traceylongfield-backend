import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { questionService } from "./question.service";

// Create a new Question
export const createQuestion = catchAsync(async (req, res) => {
  const data = req.body
  const question = await questionService.createQuestion(data);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Question created successfully",
    data: question,
  });
});

// Get all Questions
export const getQuestions = catchAsync(async (req, res) => {
  const questions = await questionService.getQuestions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Questions retrieved successfully",
    data: questions,
  });
});

// Get a Question by ID
export const getQuestionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const question = await questionService.getQuestionById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Question retrieved successfully",
    data: question,
  });
});

// Update a Question by ID
export const updateQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updatedQuestion = await questionService.updateQuestion(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Question updated successfully",
    data: updatedQuestion,
  });
});

// Delete a Question by ID
export const deleteQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
 const result= await questionService.deleteQuestion(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Question updated successfully",
    data:result ,
  });
});

export const questionController={
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
 
}