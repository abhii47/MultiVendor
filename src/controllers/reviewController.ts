import { Request,Response,NextFunction } from "express";
import reviewService from "../services/reviewService";
import { successResponse } from "../utils/response";
import logger from "../utils/logger";
 
export const postReview = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const files = (req.files as Express.MulterS3.File[])||[];
        const review = await reviewService.postReview(userId,req.body,files);
        logger.info("Review posted", {
            userId,
            reviewId: review.review_id,
            productId: review.product_id,
            rating: review.rating,
            imageCount: files.length,
        });
        successResponse(res,"Review Posted Successfully",201,review);
    } catch (err:any) {
        next(err);
    }
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
        logger.warn("Review deleted", {
            userId,
            reviewId,
            productId: review.product_id,
        });
        successResponse(res,"Review deleted successfully",200,review);
    } catch (err:any) {
        next(err);
    }
}