import { Request,Response,NextFunction } from "express";
import { successResponse } from "../utils/response";
import categoryService from "../services/categoryService";

export const createCategory = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const {name} = req.body;
        const category = await categoryService.createCategory(name);
        successResponse(res,"Category created successfully",201,category);
    } catch (err) {
        next(err);
    }
}

export const getCategory = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const allCategory = await categoryService.getCategories();
        successResponse(res,"Categories",200,allCategory); 
    } catch (err) {
        next(err);
    }
}

export const deleteCategory = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const id = Number(req.params.id);
        await categoryService.deleteCategory(id);
        successResponse(res,"delete category Successfully",200);
    } catch (err) {
        next(err);
    }
}