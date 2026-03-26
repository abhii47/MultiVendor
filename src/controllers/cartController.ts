import { Request,Response,NextFunction } from "express";
import cartService from "../services/cartService";
import { successResponse } from "../utils/response";


export const addCart = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const cartData = await cartService.addCart(req.body,userId);
        const data = {
            cartitem_id:cartData.cartitem_id,
            product_id:cartData.product_id,
            cart_id:cartData.cart_id,
            quantity:cartData.quantity
        }
        successResponse(res,"Product added in Cart",201,data);
    } catch (err) {
        next(err);
    }
}

export const getCart = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const userId = req.user.id;
    const cartData = await cartService.getCart(userId);
    const data = cartData.cartItem.map((item)=>({
        cartitem_id:item.cartitem_id,
        product_id:item.product_id,
        cart_id:item.cart_id,
        quantity:item.quantity,
    }));
    const totalAmount = cartData.total;
    const totalProduct = cartData.count;
    successResponse(res,"Cart Products",200,{totalAmount,totalProduct,data});
}

export const removeCart = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const userId = req.user.id;
    const cartitemId = Number(req.params.id);
    await cartService.removeCart(userId,cartitemId);
    successResponse(res,"Product removed from Cart",200);
}