import { DeleteObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getEnv, s3 } from "../config/s3Client";
import ApiError from "./apiError";
import logger from "./logger";

// Delete a file from S3 using its key (e.g. "products/1234567890-shirt.jpg")
export const deletefromS3 = async(key:string) => {
    try {
        await s3.send(new DeleteObjectCommand({
            Bucket:getEnv("AWS_BUCKET_NAME"),
            Key:key,
        }));
    } catch (err:any) {
        throw new ApiError("Failed to delete file from S3",500);
    }
}


// Generate a temporary signed URL for a private bucket
// URL expires in 1 hour by default — client uses this to display the image
export const getImageUrl = async(key:string,expiresIn = 3600) => {
    try {
        const command = new GetObjectCommand({
            Bucket:getEnv("AWS_BUCKET_NAME"),
            Key:key,
        });
        return await getSignedUrl(s3,command,{expiresIn});
    } catch (err:any) {
        logger.error("Signed URL error", { err, key });
        throw new ApiError("Failed to fetch file", 500);
    }
}
