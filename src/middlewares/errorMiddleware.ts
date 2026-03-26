import ApiError from "../utils/apiError";
import {Request,Response,NextFunction} from 'express';

const errHandler = (err:Error,req:Request,res:Response,next:NextFunction) =>{
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({success:false,message:'Token expired. Please refresh your token.'});
    } 
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({success:false,message:'Invalid token. Please log in again.'});
    }
    const statusCode = err instanceof ApiError?err.statusCode:500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({success:false,message});
}

export default errHandler;