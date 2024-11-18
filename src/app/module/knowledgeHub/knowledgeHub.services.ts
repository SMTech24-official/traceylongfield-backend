import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { IVideo } from "./knowledgeHub.interface"
import { Video } from "./knowledgeHub.model"

const addKnowledgeHubVideo=async(payload:IVideo)=>{
    if(!payload.videoUrl) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE,"invalid input")
    }
    const haveVideo=await Video.find()
    if(haveVideo.length>0){
        throw new AppError(httpStatus.CONFLICT,"Video already exist")
    }
    const addVideo=await Video.create(payload)
    return addVideo

}
// delete video

const deleteKnowledgeHubVideo=async(id:string)=>{
    const haveVideo=await Video.find()
    if(haveVideo.length===0){
        throw new AppError(httpStatus.CONFLICT,"Video not found")
    }
    const deleteVideo=await Video.deleteMany()
    if(!deleteVideo){
        throw new AppError(httpStatus.NOT_FOUND,"Video not found")
    }
    return deleteVideo
}

// get video

const getKnowledgeHubVideo=async()=>{
    const haveVideo=await Video.find()
    if(haveVideo.length===0){
        throw new AppError(httpStatus.NOT_FOUND,"Video not found")
    }
    return haveVideo[0]
}
//update video

const updateKnowledgeHubVideo=async(id:string,payload:IVideo)=>{
    const haveVideo=await Video.findById(id)
    if(!haveVideo){
        throw new AppError(httpStatus.NOT_FOUND,"Video not found")
    }
    if(!payload.videoUrl) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE,"invalid input")
    }
    const updateVideo=await Video.findByIdAndUpdate(id, payload, {new: true})
    return updateVideo
}
export const knowledgeHubService={
    addKnowledgeHubVideo,
    deleteKnowledgeHubVideo,
    updateKnowledgeHubVideo,
    getKnowledgeHubVideo
}