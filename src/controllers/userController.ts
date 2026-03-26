import { Request,Response,NextFunction } from "express";
import userService from "../services/userService";
import { successResponse } from "../utils/response";

// export const getUsers = async(
//     req:Request,
//     res:Response,
//     next:NextFunction
// )=>{
//     try {
//         const users = await userService.getUsers();
//         successResponse(res,"All Users",200,users);
//     } catch (err) {
//         next(err);
//     }
// }

export const deleteUser = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        await userService.deleteUser(userId);
        successResponse(res,"User deleted successfully",200);
    } catch (err) {
        next(err);
    }
}

export const getUsers = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const users = await userService.getUsers(req.body);
        const totalUser = users.count;
        const totalPage = Math.ceil(totalUser/users.limit)
        const currentPage = users.page;
        const data = users.rows;
        successResponse(res,"Users",200,{totalUser,totalPage,currentPage,data});
    } catch (err) {
        next(err);
    }
}