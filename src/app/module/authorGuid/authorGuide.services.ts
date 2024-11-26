import { Request } from "express";
import { IAuthorGuid } from "./authorGuide.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { AuthorGuid } from "./authorGuide.model";
import { User } from "../users/user.model";

const addAuthorGuide = async (req: Request) => {
  const files = req.files as any;
  if (!files || !files.cover || !files.pdfFile) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "File is required for  add guide"
    );
  }

  const cover = files.cover.map((file: any) => ({
    fileName: file?.filename,
    url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
  }));
  const pdfFile = files.pdfFile.map((file: any) => ({
    fileName: file?.filename,
    url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
  }));
  if (!req.body.data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid request body");
  }
  let Data;
  try {
    Data = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in request body");
  }

  const payload = {
    ...Data,
    cover: cover[0].url,
    pdfFile: pdfFile[0].url,
  };
  const authorGuide: IAuthorGuid = await AuthorGuid.create(payload);
  return authorGuide;
};

// get all author guides
const getAllAuthorGuides = async () => {
  const authorGuides = await AuthorGuid.find();
  return authorGuides;
};
// get single author guide
const getAuthorGuideById = async (id: string) => {
  const authorGuide = await AuthorGuid.findById(id);
  if (!authorGuide) {
    throw new AppError(httpStatus.NOT_FOUND, "Author guide not found");
  }
  return authorGuide;
};
// update author guide
const updateAuthorGuide = async (req: Request) => {
  const id = req.params.id as string;
  const files = req.files as any;
  let cover;
  let pdfFile;
  if (files.cover) {
    cover = files?.cover?.map((file: any) => ({
      fileName: file?.filename,
      url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
    }));
  }
  if (files.pdfFile) {
    pdfFile = files?.pdfFile?.map((file: any) => ({
      fileName: file?.filename,
      url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
    }));
  }
  if (!req.body.data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid request body");
  }
  let Data;
  try {
    Data = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in request body");
  }

  const updateDoc: Partial<IAuthorGuid> = {};
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

  const authorGuide = await AuthorGuid.findByIdAndUpdate(id, updateDoc, {
    new: true,
  });
  return authorGuide
};
// delete author guide 
const deleteAuthorGuide = async (id: string) => {
  const authorGuide = await AuthorGuid.findByIdAndDelete(id);
  if (!authorGuide) {
    throw new AppError(httpStatus.NOT_FOUND, "Author guide not found");
  }
  return authorGuide;
};

export const authorGuideService = {
  addAuthorGuide,
  updateAuthorGuide,
  getAllAuthorGuides,
  getAuthorGuideById,
  deleteAuthorGuide,
 
};
