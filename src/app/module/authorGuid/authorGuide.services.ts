import { Request } from "express";
import { IAuthorGuid } from "./authorGuide.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { AuthorGuid } from "./authorGuide.model";
import { User } from "../users/user.model";
import { fileUploader } from "../../helpers/fileUpload";

const addAuthorGuide = async (req: Request) => {
  const files = req.files as any;
  if (!files || !files.cover || !files.pdfFile) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "File is required for  add guide"
    );
  }
 
  const cover = await fileUploader.uploadToDigitalOcean(files.cover[0]);
  const pdfFile = await fileUploader.uploadToDigitalOcean(files.pdfFile[0]);
 





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
    cover: cover.Location,
    pdfFile: pdfFile.Location,
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
     cover = await fileUploader.uploadToDigitalOcean(files.cover[0]);
  }
  if (files.pdfFile) {
    pdfFile = await fileUploader.uploadToDigitalOcean(files.pdfFile[0]);
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
    updateDoc.cover = cover.Location;
  }
  if (pdfFile) {
    updateDoc.pdfFile = pdfFile.Location;
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
