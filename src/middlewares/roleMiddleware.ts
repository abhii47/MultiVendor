import { Request,Response,NextFunction } from "express";
import ApiError from "../utils/apiError";

type roleId = 1 | 2 | 3;

export const allowRoles = (allowRoles:roleId[]) =>{
    return (req:Request,res:Response,next:NextFunction) =>{
        try {
            const userRoleId = req.user.role;
            if(!allowRoles.includes(userRoleId as roleId)){
                throw new ApiError("Permission Denied",403);
            }
            next();
        } catch (err) {
            next(err);
        }
    }
}