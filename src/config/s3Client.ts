import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

export const getEnv = (key:string):string => {
    const value = process.env[key];

    if(!value){
        throw new Error(`Missing Environment variable ${key}`);
    }
    return value;
}

export const s3 = new S3Client({
    region:getEnv("AWS_REGION"),
    credentials:{
        accessKeyId:getEnv("AWS_ACCESS_KEY"),
        secretAccessKey:getEnv("AWS_SECRET_KEY"),
    },
});