import { S3Client } from "@aws-sdk/client-s3";
import { getEnv, loadEnv } from "./env";

loadEnv();

export { getEnv } from "./env";

export const s3 = new S3Client({
    region:getEnv("AWS_REGION"),
    credentials:{
        accessKeyId:getEnv("AWS_ACCESS_KEY"),
        secretAccessKey:getEnv("AWS_SECRET_KEY"),
    },
});
