import {Request,Response,NextFunction} from "express";
import { successResponse } from "../utils/response";
import vendorService from "../services/vendorService";
import ApiError from "../utils/apiError";
import logger from "../utils/logger";

export const createProfile = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const userId = req.user.id;
        const profile = await vendorService.createProfile(userId,req.body);
        logger.info("Vendor profile created", {
            userId,
            shopName: profile.shopname,
            status: profile.status,
        });
        successResponse(res,"Profile created",200,profile);
    } catch (err) {
        next(err);
    }
}

export const getProfile = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const userId = req.user.id
        const profile = await vendorService.getProfile(userId);
        successResponse(res,"User Profile",200,profile);
    } catch (err) {
        next(err);
    }
}

export const updateProfile = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const {shopname,city,state} = req.body;
        if(!shopname && !city && !state){
            throw new ApiError("Atleast one field required",400);
        }
        const userId = req.user.id;
        const profile = await vendorService.updateProfile(userId,req.body);
        logger.info("Vendor profile updated", {
            userId,
            profileUserId: profile.id,
        });
        successResponse(res,"Profile Updated SuccessFully",200,profile);
    } catch (err) {
        next(err);
    }
}

export const verifyVendor = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        const users = await vendorService.verifyVendor(userId);
        logger.info("Vendor verification updated", {
            vendorUserId: userId,
            actorAdminId: req.user?.id,
            statusMessage: users.msg,
        });
        successResponse(res,users.msg,200,users.vendors);
    } catch (err) {
        next(err);
    }
}

export const vendorDashboard = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const userId = req.user.id;
        const dash = await vendorService.vendorDashboard(userId);
        successResponse(
            res,
            "Dashboard",
            200,
            {
                totalProduct:dash.totalProduct,
                totalOrder:dash.totalOrder,
                totalSell:dash.totalRevenue,
                topSelling:dash.topSellProduct,
            }
        );
    } catch (err) {
        next(err);
    }
}
