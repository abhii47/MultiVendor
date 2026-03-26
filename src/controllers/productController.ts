import { Request,Response,NextFunction } from "express";
import productService from "../services/productService";
import { successResponse } from "../utils/response";


export const createProduct = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user.id;
        const filename = req.file?.filename;
        const product = await productService.createProduct(req.body,userId,filename);
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
        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/products/`;
        const products = await productService.getProducts(vendorId,baseUrl);
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
        successResponse(res,"Product deleted successfully",200);
    } catch (err) {
        next(err);
    }
}

// export const getUserProducts = async(
//     req:Request,
//     res:Response,
//     next:NextFunction
// ) => {
//     try {
//         const products = await productService.getUserProducts();
//         const totalProduct=products.count;
//         const data=products.rows;
//         successResponse(res,"All Products",200,{totalProduct,data});
//     } catch (err) {
//         next(err);
//     }
// }
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
