import ApiError from "../utils/apiError";
import {Request,Response,NextFunction} from 'express';
import logger from "../utils/logger";

const errHandler = (err:Error,req:Request,res:Response,next:NextFunction) =>{
    let statusCode = err instanceof ApiError?err.statusCode:500;

    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        statusCode = 401;
    }

    const logLevel = statusCode >= 500 ? "error" : "warn";

    logger.log(logLevel, "Error occured", {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        statusCode,
    });

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({success:false,message:'Token expired. Please refresh your token.'});
    } 
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({success:false,message:'Invalid token. Please log in again.'});
    }
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({success:false,message});
}

export default errHandler;
