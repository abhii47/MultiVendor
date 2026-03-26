import { Request,Response,NextFunction } from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import ApiError from '../utils/apiError';

interface user extends JwtPayload{
        id:number,
        role:number,
        email:string
}
const Auth = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        //check the token available or not
        const authHeader = req.headers.authorization;
        if(!authHeader) throw new ApiError("Unauthorized",401);

        //check environment variable exist or not
        const secret = process.env.ACCESS_TOKEN
        if(!secret) throw new ApiError("Missing environment vars",400);

        //check provided token format
        if(!authHeader.startsWith("Bearer ")){
            throw new ApiError("Invalid token format",401);
        }
        //get exact token and all details saved inside it
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token,secret) as user;

        //store the user payload in request body so get in each request
        req.user = { 
            id:decode.id,
            role:decode.role,
            email:decode.email
        }

        next();
    } catch (err) {    
        next(err);
    }
}

export default Auth;