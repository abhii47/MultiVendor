import { Request,Response,NextFunction } from "express";
import orderService from "../services/orderService";
import { successResponse } from "../utils/response";
import { UniqueConstraintError } from "sequelize";
import ApiError from "../utils/apiError";

export const createOrder = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const {coupon} = req.body;
        const order = await orderService.createOrder(userId,coupon);
        const data = {
            order_id:order.order_id,
            user_id:order.user_id,
            total_amount:order.total_amount,
            status:order.status
        }
        successResponse(res,"Order Pending, Complete the Payment Process....",201,data);
    } catch (err:any) {
        //for race condtion
        if (err instanceof UniqueConstraintError) {
            throw new ApiError("You have already used this coupon", 403);
        }
        next(err);
    }
}
export const addCard = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const card = await orderService.addCard(userId);
        const data = {
            card_id:card.card_id,
            brand:card.brand,
            last4:card.last4,
            exp_month:card.exp_month,
            exp_year:card.exp_year,
            is_default:card.is_default,
        }
        successResponse(res,"Card added successfully",201,data);
    } catch (err) {
        next(err)
    }
}
export const createPayment = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const order = await orderService.createPayment(userId,req.body);
        successResponse(res,'Your Order Placed Successfully',200,order);
    } catch (err) {
        next(err)
    }   
}
export const getOrder = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const userId = req.user.id;
        const orders = await orderService.getOrder(userId);
        successResponse(res,"Orders",200,orders);
    } catch (err:any) {
        next(err);
    }
}
export const cancelOrder = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.user.id;
        const data = await orderService.cancelOrder(userId,orderId);
        successResponse(res,"Cancelled order successfully",200,data);
    } catch (err:any) {
        next(err)
    }
}
export const deliverOrder = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const orderId = Number(req.params.id);
        // const userId = req.user.id;
        const order = await orderService.deliverOrder(orderId);
        successResponse(res,"Order Delivered Successfully",200,order);
    } catch (err:any) {
        next(err)
    }
}