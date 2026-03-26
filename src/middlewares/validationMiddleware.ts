import { validationResult } from "express-validator";
import { Request,Response,NextFunction } from "express";

export const validationError = (req:Request,res:Response,next:NextFunction) =>{

        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(422).json({
                success:false,
                message:error.array()
            });
        }
        next();
}
