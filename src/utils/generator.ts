import jwt from 'jsonwebtoken';
import ApiError from './apiError';
import { Coupon } from '../models';
type user = {
    id:number,
    role:number,
    email:string
}

//generate acceessToken
export const generateAccessToken = (user:user) =>{
    const secret = process.env.ACCESS_TOKEN
    if(!secret) throw new ApiError("Missing Environment variable",400);
    const token = jwt.sign(
        {id:user.id,role:user.role,email:user.email},
        secret,
        {expiresIn:"2H"}
    );
    return token;
}

//generate refreshToken
export const generateRefreshToken = (user:user) =>{
    const secret = process.env.REFRESH_TOKEN
    if(!secret) throw new ApiError("Missing Environment variable",400);
    const token = jwt.sign(
        {id:user.id,role:user.role,email:user.email},
        secret,
        {expiresIn:"7d"}
    );
    return token;
}

//generate unique code
export const uniqueCouponCode = () => {
    let code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
    // while(true){
    //     let code = String(Math.floor(100000 + Math.random() * 900000));

    //     const coupon = await Coupon.findOne({
    //         where:{coupon_code:code}
    //     });

    //     if(!coupon){
    //         return code;
    //     }
    // }
};


