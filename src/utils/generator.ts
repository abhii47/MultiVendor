import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';

type user = {
    id:number,
    role:number,
    email:string
}
//generate acceessToken
export const generateAccessToken = (user:user) =>{
    const secret = getEnv('ACCESS_TOKEN');
    const token = jwt.sign(
        {id:user.id,role:user.role,email:user.email},
        secret,
        {expiresIn:"2H"}
    );
    return token;
}
//generate refreshToken
export const generateRefreshToken = (user:user) =>{
    const secret = getEnv('REFRESH_TOKEN');
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
};


