import { Request,Response,NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from 'fs'
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
        const uploadDir = path.join(__dirname,`../uploads/${folder}`);
        fs.mkdirSync(uploadDir,{recursive:true});

        //set the destination and filename inside localstorage
        const storage = multer.diskStorage({
            destination:(req,file,cb) => {
                cb(null,uploadDir);
            },
            filename:(req,file,cb) =>{
                cb(null,`${Date.now()}-${file.originalname}`);
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
        const handler = type === 'array'?uploader.array(fieldName,maxFile):uploader.single(fieldName);

        //call above function handle err 
        handler(req,res,(err)=>{
            if(err) return next(err);
            next();
        });
    }
}


// export const uploadProduct = async(req:Request,res:Response,next:NextFunction) => {

//         //if folder doen't exist then create automatically
//         const uploadDir = path.join(__dirname,'../uploads/products');
//         fs.mkdirSync(uploadDir,{recursive:true});

//         //set the destination and filename inside localstorage
//         const storage = multer.diskStorage({
//             destination:(req,file,cb) => {
//                 cb(null,uploadDir);
//             },
//             filename:(req,file,cb) =>{
//                 cb(null,`${Date.now()}-${file.originalname}`);
//             }
//         });
        
//         //Available Types of uploading images
//         const allowMimetype = ["image/jpg","image/jpeg","application/pdf","image/png"]

//         //upload the file 
//         const uploadFile = multer({
//             storage,
//             limits:{fileSize: 5 * 1024 * 1024 }, //only 5MB file can be uploaded
//             fileFilter:(req,file,cb)=>{
//                 if(!allowMimetype.includes(file.mimetype)){
//                     throw new ApiError("File type not allowed",422);
//                 }
//                 cb(null,true);
//             }
//         }).single('image');

//         //call above function handle err 
//         uploadFile(req,res,(err)=>{
//         if(err) return next(err);
//         next();
//     });
// }

