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
exports.pointService = void 0;
const points_model_1 = require("./points.model");
const addPointWithType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield points_model_1.Point.create(payload);
    if (!result) {
        throw new Error("Failed to insert point into DB");
    }
    return result;
});
// get all points list
const getAllPoints = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield points_model_1.Point.find();
    if (!result) {
        throw new Error("Failed to fetch points from DB");
    }
    return result;
});
// get single point
const getSinglePoint = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield points_model_1.Point.findById(id);
    if (!result) {
        throw new Error("Failed to fetch point from DB");
    }
    return result;
});
// update point
const updatePoint = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the id and payload are provided and valid
    if (!id || !payload || typeof id !== 'string') {
        throw new Error("Invalid input: id and payload are required");
    }
    let updateDoc = {};
    // Only include the points property if it is provided in the payload
    if (payload.points !== undefined) {
        updateDoc.points = payload.points;
    }
    // Perform the update in the database
    const result = yield points_model_1.Point.findByIdAndUpdate(id, updateDoc, { new: true });
    // If the update fails or no document is returned, throw an error
    if (!result) {
        throw new Error("Failed to update point in DB");
    }
    return result;
});
// delete point
const deletePoint = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield points_model_1.Point.findByIdAndDelete(id);
    if (!result) {
        throw new Error("Failed to delete point from DB");
    }
    return result;
});
// export the service for use in other parts of the application
exports.pointService = {
    addPointWithType,
    getAllPoints,
    getSinglePoint,
    updatePoint,
    deletePoint
};
