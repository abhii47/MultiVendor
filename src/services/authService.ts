import { Response } from "express";
import { Otp, RefreshToken,StripeCustomer,User} from "../models";
import { generateAccessToken,generateRefreshToken} from "../utils/generator";
import bcrypt from 'bcrypt';
import ApiError from "../utils/apiError";
import sequelize from "../config/db";
import {getValue, roles} from "../utils/roleAssign";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { userLoginLog } from "../utils/loginLog";
import { sendOtpEmail } from "../utils/sendEmail";
import { createCustomer } from "./stripeService";

type RegBody = {
    name:string,
    email:string,
    password:string,
    role:number,
}
export const register = async(body:RegBody) =>{
    const {name,email,password,role} = body;
    
    //Verify Roles
    if (!Object.values(roles).includes(role) || role === roles.admin) {
        throw new ApiError("Invalid role provided", 400);
    }

    //hashed password
    const hashedPass:string = await bcrypt.hash(password,10);

    //transaction for creating user
    const user = await sequelize.transaction(async(t)=>{

        //Verify User
        const existUser = await User.findOne({where:{email},transaction:t})
        if(existUser) throw new ApiError("User already exists.",400);    

        const user = await User.create({
            name,
            email,
            password:hashedPass,
            role:role,
        },{transaction:t});

        return user;
    });

    // Create Customer On Stripe 
    let stripe_customer_id: string | null = null;
    if(user.role === getValue('user')){
        
        const customer = await createCustomer(user.name,user.email);

        //save that customer's stripe id in DB
        const stripe_customer = await StripeCustomer.create({
            stripe_customer_id:customer.id,
            user_id:user.user_id,
        });
        stripe_customer_id = stripe_customer.stripe_customer_id;
    }

    const data = {
        name:user.name,
        email:user.email,
        role:user.role,
        stripe_customer_id:stripe_customer_id
    }

    return data
}

export const forgetPass = async(email:string,otp:number) =>{

    //check user exist or not
    const existuser = await User.findOne({where:{email}});
    if(!existuser) throw new ApiError("Email Not Register Yet!",400);

    //send email with otp
    await sendOtpEmail(email,otp);

    //Store otp with expiry date in DB
    const existOtp = await Otp.findOne({where:{email}});
    if(existOtp){
        await Otp.update({
            otp,
            expires_in:new Date(Date.now() + 5 * 60 * 1000)
        },
        {where:{email}});
    }else{
        await Otp.create({
            email,
            otp,
            expires_in:new Date(Date.now() + 5 * 60 * 1000)
        });
    }
} 

type setPassBody = {
    email:string,
    otp:number,
    newpass:string,
    confirmpass:string
}
export const setPass = async(body:setPassBody) =>{
    const {email,otp,newpass,confirmpass} = body;

    //check mail record
    const otpData = await Otp.findOne({where:{email}});
    if(!otpData) throw new ApiError("Wrong Email",400);

    //match the otp
    if(otpData.otp !== otp) throw new ApiError("Your otp is incorrect",400);

    //check expiry
    if(otpData.expires_in<new Date(Date.now())){
        await otpData.destroy();
        throw new ApiError("Your Otp Expired",400);
    } 

    //check both password(cpass & pass)
    if(confirmpass !== newpass) throw new ApiError("both password not matched",400);

    //hashing the password
    const hashedPass = await bcrypt.hash(newpass,10);

    //change the password of user
    await User.update({password:hashedPass},{where:{email}});

    //after changing password destroy the otp
    await otpData.destroy();
}

type LogBody = {
    email:string,
    password:string
}
export const login = async(res:Response,ip:string,body:LogBody) =>{
        const {email,password} = body;

        //fetch user
        const user = await User.findOne({where:{email},});
        if(!user) throw new ApiError("User Not Found",404);

        //verify password
        const matchPass = await bcrypt.compare(password,user.password);
        if(!matchPass){
            //create logs
            await userLoginLog(user.user_id,'Failed',ip);
            throw new ApiError("Credential not correct",401);
        } 

        //pass data for generating token
        const userData ={ id: user.user_id, role: user.role, email: user.email }

        //generate the both tokens
        const newAccessToken = generateAccessToken(userData);
        const newRefreshToken = generateRefreshToken(userData);

        const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        //findone + update or create refresh token in DB and create logs
        await Promise.all([
            RefreshToken.upsert({
                user_id: user.user_id,
                token: newRefreshToken,
                expires_in: tokenExpiry
            }),
            userLoginLog(user.user_id,'Success',ip),
        ]);

        //Set Cookie
        res.cookie('refreshToken',newRefreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        });

        const data = {
            name:user.name,
            email:user.email,
            role:user.role,
            token:newAccessToken
        }

        return data;
}

export const refresh = async(res:Response,refresh:string) =>{

    //check secret key
    const secret = process.env.REFRESH_TOKEN;
    if(!secret) throw new ApiError("Secret Key is missing",401);

    //decode refresh token which gets from cookie
    const decodeRefresh = jwt.verify(refresh,secret) as JwtPayload;

    //check refresh token inside DB
    const storedToken = await RefreshToken.findOne({where:{user_id:decodeRefresh.id}});
    if(!storedToken) throw new ApiError("Invalid refresh token",401); 

    //check token match
    if(storedToken.token !== refresh){
        throw new ApiError("Token not matched",401);
    }

    //check Expiry date
    if(storedToken.expires_in<new Date(Date.now())){
        throw new ApiError("Your token is expired",401);
    }

    const userData = {
        id:decodeRefresh.id,
        role:decodeRefresh.role,
        email:decodeRefresh.email
    }

    //generate again token
    const newAccessToken = generateAccessToken(userData);
    const newRefreshToken = generateRefreshToken(userData);

    //refresh token stored in Db
    await storedToken.update({
        token:newRefreshToken,
        expires_in:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    //pass inside httpOnly cookie
    res.cookie('refreshToken',newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7 * 24 * 60 * 60 * 1000
    });

    return {
        newAccessToken
    };

}

export const changePass = async(existPass:string,pass:string,userId:number) =>{

    //get user for getting actual existing password
    const user = await User.findOne({where:{user_id:userId}});

    //match existing pass
    const matchPass = await bcrypt.compare(existPass,user!.password);
    if(!matchPass) throw new ApiError("Pass Correct Information",400);

    //hashing password
    const hashedPass = await bcrypt.hash(pass,10);
    //change the password
    await User.update({
        password:hashedPass
    },{
        where:{user_id:userId}
    });
}

export const logout = async(res:Response,userId:number,ip:string)=>{

    //destroy the refresh token from db
    const checkToken = await RefreshToken.findOne({where:{user_id:userId}});
    if(!checkToken){
        throw new ApiError("Invalid token",401);
    }
    await checkToken.destroy();
    //create logs
    await userLoginLog(userId,'Success',ip,true);

    //clear token from httpOnly cookie
    res.clearCookie('refreshToken');
    
}

export default {register,forgetPass,setPass,login,refresh,changePass,logout}

