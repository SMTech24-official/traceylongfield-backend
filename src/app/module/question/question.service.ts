import { IQuestion } from "./question.interface";
import { Question } from "./question.model";


// Create a new Question
const createQuestion = async (data: IQuestion) => {
  return await Question.create(data);
};

// Get all Questions
 const getQuestions = async () => {
  return await Question.find();
};

 const getQuestionById = async (id: string) => {
  const question = await Question.findById(id);
  if (!question) {
    throw new Error("Question not found");
  }
  return question;
};

// Update a Question by ID
 const updateQuestion = async (id: string, data: Partial<IQuestion>) => {
  const question = await Question.findById(id);
  if (!question) {
    throw new Error("Question not found");
  }
  const updatedQuestion = await Question.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedQuestion) {
    throw new Error("Question not found");
  }
  return updatedQuestion;
};

// Delete a Question by ID
 const deleteQuestion = async (id: string) => {
  const question = await Question.findById(id);
  if (!question) {
    throw new Error("Question not found");
  }
  const deletedQuestion = await Question.findByIdAndDelete(id);
  if (!deletedQuestion) {
    throw new Error("Question not found");
  }
};

export const questionService={
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
}