import { Request,Response,NextFunction } from "express";
import productService from "../services/productService";
import { successResponse } from "../utils/response";
import logger from "../utils/logger";


export const createProduct = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const filekey = (req.file as Express.MulterS3.File)?.key;
        const product = await productService.createProduct(req.body,userId,filekey);
        logger.info("Product upsert completed", {
            vendorUserId: userId,
            productId: product.data.id,
            productName: product.data.name,
            action: product.code === 201 ? "created" : "updated",
        });
        successResponse(res,product.msg,product.code,product.data);
    } catch (err) {
        next(err);
    }
}
export const getProducts = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const vendorId = req.user.id;
        // const baseUrl = `${req.protocol}://${req.get('host')}/uploads/products/`;
        const products = await productService.getProducts(vendorId);
        successResponse(res,"Products",200,products);
    } catch (err) {
        next(err);
    }
}
export const deleteProduct = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const productId = Number(req.params.id);
        const userId = req.user.id;
        await productService.deleteProduct(productId,userId);
        logger.warn("Product deleted", {
            vendorUserId: userId,
            productId,
        });
        successResponse(res,"Product deleted successfully",200);
    } catch (err) {
        next(err);
    }
}
export const getUserProducts = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const products = await productService.getUserProducts(req.body);
        const totalProduct = products.count;
        const currentPage = products.page;
        const totalPage = Math.ceil(totalProduct/products.limit);
        const data = products.rows; 
        successResponse(res,"Products",200,{totalProduct,currentPage,totalPage,data});
    } catch (err) {
        next(err);
    }
}
