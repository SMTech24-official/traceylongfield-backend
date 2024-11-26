import { IPoints } from "./points.interface";
import { Point } from "./points.model";

const addPointWithType = async (payload: IPoints) => {
  const result = await Point.create(payload);
  if (!result) {
    throw new Error("Failed to insert point into DB");
  }
  return result;
};

// get all points list

const getAllPoints = async () => {
  const result = await Point.find();
  if (!result) {
    throw new Error("Failed to fetch points from DB");
  }
  return result;
};
// get single point

const getSinglePoint = async (id: string) => {
  const result = await Point.findById(id);
  if (!result) {
    throw new Error("Failed to fetch point from DB");
  }
  return result;
};
// update point

const updatePoint = async (id: string, payload: IPoints) => {
  
    // Check if the id and payload are provided and valid
    if (!id || !payload || typeof id !== 'string') {
      throw new Error("Invalid input: id and payload are required");
    }
  
    let updateDoc: Partial<IPoints> = {};
  
    // Only include the points property if it is provided in the payload
    if (payload.points !== undefined) {
      updateDoc.points = payload.points;
    }
  
    // Perform the update in the database
    const result = await Point.findByIdAndUpdate(id, updateDoc, { new: true });
  
    // If the update fails or no document is returned, throw an error
    if (!result) {
      throw new Error("Failed to update point in DB");
    }
  
    return result;
  };
  
  // delete point
  
  const deletePoint = async (id: string) => {
    const result = await Point.findByIdAndDelete(id);
  
    if (!result) {
      throw new Error("Failed to delete point from DB");
    }
  
    return result;
  };

  // export the service for use in other parts of the application

export const pointService = {
  addPointWithType,
  getAllPoints,
  getSinglePoint,
  updatePoint,
  deletePoint
};
