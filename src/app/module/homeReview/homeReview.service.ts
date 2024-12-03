import { HomeReview } from "./homeReview.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IHomeReview } from "./homeReview.interface";
import { Request } from "express";
import { fileUploader } from "../../helpers/fileUpload";

// Create a new HomeReview
const createHomeReview = async (req: Request) => {

if(   !req.file){
  throw new AppError(httpStatus.BAD_REQUEST, "Please upload a author image");
}
if(!req.body.data){
  throw new AppError(httpStatus.BAD_REQUEST, "Invalid request body");
}
const data=JSON.parse(req.body.data);
const image=await fileUploader.uploadToDigitalOcean(req.file)

const homeReview ={
  image:image.Location,
 ...data
};
const result=await HomeReview.create(homeReview)

return result;

};

// Get all HomeReviews
const getAllHomeReviews = async () => {
  const homeReviews = await HomeReview.find();
  return homeReviews;
};

// Get a HomeReview by ID
const getHomeReviewById = async (id: string) => {
  const homeReview = await HomeReview.findById(id);
  if (!homeReview) {
    throw new AppError(httpStatus.NOT_FOUND, "HomeReview not found");
  }
  return homeReview;
};

const updateHomeReview = async (req: Request, id: string) => {
  // Validate the request body and file upload
 

  const homeReview = await HomeReview.findById(id);

  // If the HomeReview does not exist, throw an error
  if (!homeReview) {
    throw new AppError(httpStatus.NOT_FOUND, "HomeReview not found");
  }

  let image: any = homeReview.image; // Keep the existing image if not updating

  // Check if a new image is uploaded, if so, upload it to DigitalOcean
  if (req.file) {
    image = (await fileUploader.uploadToDigitalOcean(req.file)).Location;
  }

  // Parse and extract the new data from the request
  let data = req.body.data ? JSON.parse(req.body.data) : {};

  // Update the HomeReview fields with new values
  const updatedHomeReview = await HomeReview.findByIdAndUpdate(
    id,
    { ...data, image: image }, // Merge the new data and image
    { new: true, runValidators: true } // `new: true` returns the updated document
  );

  // If update fails, throw an error
  if (!updatedHomeReview) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating HomeReview");
  }

  return updatedHomeReview;
};

// Delete HomeReview by ID
const deleteHomeReview = async (id: string) => {
  const deletedHomeReview = await HomeReview.findByIdAndDelete(id);
  if (!deletedHomeReview) {
    throw new AppError(httpStatus.NOT_FOUND, "HomeReview not found");
  }
  return deletedHomeReview;
};

export const homeReviewService = {
  createHomeReview,
  getAllHomeReviews,
  getHomeReviewById,
  updateHomeReview,
  deleteHomeReview,
  
};
