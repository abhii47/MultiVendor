import { Request,Response,NextFunction } from "express";
import { successResponse } from "../utils/response";
import authService from "../services/authService";
import ApiError from "../utils/apiError";


export const register = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const user = await authService.register(req.body);

        //send success response
        successResponse(res,"User Created Successfully",201,user);
    } catch (err) {
        next(err);
    }
}

export const forgotPass = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const {email} = req.body;
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        await authService.forgetPass(email,randomNum);
        successResponse(res,"Check Your Email",200);
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        await authService.setPass(req.body);
        successResponse(res,"Your password Reset successfully",200);
    } catch (err) {
        next(err);
    }
}

export const login = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const ip = req.ip!;
        const user = await authService.login(res,ip,req.body);

        successResponse(res,"User login successfully",201,user);

    } catch (err) {
        next(err);
    }
}

export const refresh = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken)throw new ApiError("refresh token is missing",401);

        const token = await authService.refresh(res,refreshToken);

        successResponse(res,"Token refresh successfully",200,token);

    } catch (err) {
        next(err);
    }
}

export const changePass = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const {existpass,password} = req.body
        const userId = req.user.id;
        await authService.changePass(existpass,password,userId);
        successResponse(res,"Password changed SuccessFully",200);
    } catch (err) {
        next(err);
    }
}

export const logout = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const ip = req.ip!;
        const userId = req.user.id;
        await authService.logout(res,userId,ip);
        successResponse(res,"Logout SuccessFully",200)
    } catch (err) {
        next(err);
    }
}