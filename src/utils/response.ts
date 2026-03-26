import { Response } from "express";

export const successResponse = (
    res:Response,
    message:string,
    code:number=200,
    data?:any
) => {
    return res.status(code).json({
        success:true,
        message,
        data:data
    })
}
