import { Request,Response,NextFunction } from "express";
import reviewService from "../services/reviewService";
import { successResponse } from "../utils/response";
 
export const postReview = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const userId = req.user.id;
    const files = req.files as Express.Multer.File[]
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/reviews/`;
    const review = await reviewService.postReview(userId,req.body,baseUrl,files);
    successResponse(res,"Review Posted Successfully",201,review);
}

export const deleteReview = async(
    req:Request,
    res:Response,
    next:NextFunction,
) => {
    try {
        const userId:number = req.user.id;
        const reviewId:number = Number(req.params.id);
        const review = await reviewService.deleteReview(userId,reviewId);
        successResponse(res,"Review deleted successfully",200,review);
    } catch (err) {
        next(err);
    }
}