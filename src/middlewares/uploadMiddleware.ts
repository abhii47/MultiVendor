import { Request,Response,NextFunction } from "express";
import multer from "multer";
import multerS3 from 'multer-s3';
// import path from "path";
// import fs from 'fs'
import { s3,getEnv } from '../config/s3Client';
import ApiError from "../utils/apiError";

//Available Types of uploading images
const allowMimetype = ["image/jpg","image/jpeg","application/pdf","image/png"]


type uploadType = 'single' | 'array';

interface uploadData{
    folder:string;
    type?:uploadType;
    maxFile?:number;
    fieldName?:string;
}

export const upload = (data:uploadData) => {
    return (req:Request,res:Response,next:NextFunction) => {
        const {folder,type='single',maxFile=5,fieldName='image'} = data;

        //if folder doen't exist then create automatically
        // const uploadDir = path.join(__dirname,`../uploads/${folder}`);
        // fs.mkdirSync(uploadDir,{recursive:true});

        //set the destination and filename inside localstorage
        // const storage = multer.diskStorage({
        //     destination:(req,file,cb) => {
        //         cb(null,uploadDir);
        //     },
        //     filename:(req,file,cb) =>{
        //         cb(null,`${Date.now()}-${file.originalname}`);
        //     }
        // });
        const storage = multerS3({
            s3,
            bucket:getEnv("AWS_BUCKET_NAME"),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key:(req,file,cb) => {
                // Saves as: products/1234567890-shirt.jpg
                // This "key" is what we store in DB instead of filename
                const key = `${folder}/${Date.now()}-${file.originalname}`;
                cb(null,key);
            }
        });

        //upload the file 
        const uploader = multer({
            storage,
            limits:{fileSize: 5 * 1024 * 1024 }, //only 5MB file can be uploaded
            fileFilter:(req,file,cb)=>{
                if(!allowMimetype.includes(file.mimetype)){
                    return cb(new ApiError("File type not allowed",422));
                }
                cb(null,true);
            }
        });

        //check which type for uploading
        const handler = type === 'array'
            ?uploader.array(fieldName,maxFile)
            :uploader.single(fieldName);

        //call above function handle err 
        handler(req,res,(err)=>{
            if(err) return next(err);
            next();
        });
    }
}


