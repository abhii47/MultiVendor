import { Request,Response,NextFunction } from "express";
import couponService from "../services/couponService";
import { successResponse } from "../utils/response";
import logger from "../utils/logger";

export const createCoupon = async(
    req:Request,
    res:Response,
    next:NextFunction,
) => {
    const userId = req.user.id;
    const roleId = req.user.role;
    const coupon = await couponService.createCoupon(userId,roleId,req.body);
    const data = {
        id:coupon.coupon_id,
        couponCode:coupon.coupon_code,
        couponType:coupon.coupon_type,
        max_user:coupon.max_user_limit,
        expired:coupon.expiry_date
    }
    logger.info("Coupon created", {
        couponId: coupon.coupon_id,
        couponCode: coupon.coupon_code,
        couponType: coupon.coupon_type,
        actorUserId: userId,
        actorRoleId: roleId,
    });
    successResponse(res,"Coupon Created Successfully",201,data);
}

export const deleteCoupon = async(
    req:Request,
    res:Response,
    next:NextFunction,
) => {
    const userId = req.user.id;
    const couponId = Number(req.params.id);
    const couponCode = await couponService.deleteCoupon(userId,couponId);
    logger.warn("Coupon deleted", {
        couponId,
        couponCode,
        actorUserId: userId,
    });
    successResponse(res,`${couponCode} Coupon Deleted Successfully`,201);
}