import { Response } from "express";
import { Otp, RefreshToken,User} from "../models";
import { generateAccessToken,generateRefreshToken} from "../utils/generator";
import bcrypt from 'bcrypt';
import ApiError from "../utils/apiError";
import sequelize from "../config/db";
import { roles } from "../utils/roleAssign";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { userLoginLog } from "../utils/loginLog";
import { getEnv } from "../config/env";
import { emailQueue, stripeQueue } from "../queues/Queue";

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

    // Add job to stripe queue
    await stripeQueue.add("createStripeCustomer",{
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
    });

    //Add job to email queue
    await emailQueue.add("sendWelcomeEmail",{ 
        email:user.email,
        name:user.name 
    });

    const data = {
        name:user.name,
        email:user.email,
        role:user.role,
    }

    return data
}

export const forgetPass = async(email:string,otp:number) =>{

    //check user exist or not
    const existuser = await User.findOne({where:{email}});
    if(!existuser) throw new ApiError("Email Not Register Yet!",400);

    //Check Rate Limit
    const existingOtp = await Otp.findOne({ where: { email } });
    if (existingOtp && existingOtp.expires_in > new Date()) {
        throw new ApiError("OTP already sent. Try again later.", 400);
    }

    //Generate Expiry
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 

    await Otp.upsert({
        email,
        otp,
        expires_in:expiry
    });

    await emailQueue.add("sendOtpEmail",{ email,otp });
} 

type setPassBody = {
    email:string,
    otp:number,
    newpass:string,
    confirmpass:string
}
export const setPass = async(body:setPassBody) =>{
    const {email,otp,newpass,confirmpass} = body;

    //Validate passwords
    if(confirmpass !== newpass) throw new ApiError("Passwords do not match",400);

    //Fetch OTP data
    const otpData = await Otp.findOne({where:{email}});
    if(!otpData) throw new ApiError("Invalid email or OTP",400);

    //Validate OTP
    if(otpData.otp !== otp) throw new ApiError("Invalid OTP",400);

    //Check expiry
    if(otpData.expires_in < new Date()){
        await otpData.destroy();
        throw new ApiError("OTP expired",400);
    } 

    //Hash Password
    const hashedPass = await bcrypt.hash(newpass,10);

    await sequelize.transaction(async (t) => {
        // update password
        const [updatedRows] = await User.update(
            { password: hashedPass },
            { where: { email }, transaction: t }
        );
        if (!updatedRows) throw new ApiError("User not found", 404);

        // delete OTP
        await otpData.destroy({ transaction: t });
    });
}

type LogBody = {
    email:string,
    password:string
}
export const login = async(res:Response,ip:string,body:LogBody) =>{
        const {email,password} = body;

        //Fetch user
        const user = await User.findOne({where:{email},});
        if(!user) throw new ApiError("Invalid credentials",401);

        //Verify password
        const matchPass = await bcrypt.compare(password,user.password);
        if(!matchPass){
            await userLoginLog(user.user_id,'Failed',ip);
            throw new ApiError("Invalid credentials",401);
        } 

        //Payload for token
        const userData ={ 
            id: user.user_id, 
            role: user.role, 
            email: user.email 
        }

        // Generate tokens (parallel ⚡)
        const [newAccessToken, newRefreshToken] = await Promise.all([
            generateAccessToken(userData),
            generateRefreshToken(userData),
        ]);

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
        
        //Response
        const data = {
            name:user.name,
            email:user.email,
            role:user.role,
            token:newAccessToken
        }

        return data;
}

export const refresh = async(res:Response,refresh:string) =>{

    //Get secret key
    const secret = getEnv('REFRESH_TOKEN');

    //Verify Token
    let decodeRefresh: JwtPayload;
    try {
        decodeRefresh = jwt.verify(refresh, secret) as JwtPayload;
    } catch (err) {
        throw new ApiError("Invalid refresh token", 401);
    }

    //Find token in DB
    const storedToken = await RefreshToken.findOne({
        where:{user_id:decodeRefresh.id}}
    );
    if(!storedToken) throw new ApiError("Invalid refresh token",401); 

    //Match token
    if(storedToken.token !== refresh){
        throw new ApiError("Invalid refresh token",401);
    }

    //Expiry Token
    if(storedToken.expires_in<new Date(Date.now())){
        throw new ApiError("Refresh token expired",401);
    }

    //Payload for token
    const userData = {
        id:decodeRefresh.id,
        role:decodeRefresh.role,
        email:decodeRefresh.email
    }

    // Generate tokens (parallel ⚡)
    const [newAccessToken, newRefreshToken] = await Promise.all([
        generateAccessToken(userData),
        generateRefreshToken(userData),
    ]);

    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    //Update token in DB
    await storedToken.update({
        token:newRefreshToken,
        expires_in:tokenExpiry
    });

    //Secure Cookie
    res.cookie('refreshToken',newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7 * 24 * 60 * 60 * 1000
    });

    //Response
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

