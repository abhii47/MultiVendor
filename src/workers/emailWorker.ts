import { Worker } from "bullmq";
import redis from "../config/redis";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail";
import logger from "../utils/logger";

export const emailWorker = new Worker("email", async(job) => {
    console.log("Processing job...",job.id);
    
    switch(job.name){
        case "sendOtpEmail":
            await sendOtpEmail(job.data.email,job.data.otp);
            break;
        case "sendWelcomeEmail":
            await sendWelcomeEmail(job.data.email,job.data.name);
            break;
        default:
            logger.warn(`Unknown job type: ${job.name}`);
    }
},{
    connection:redis,
});

emailWorker.on("completed",(job)=>{
    console.log(`Job ${job.id} completed successfully.`);
});

emailWorker.on("failed",(job,err)=>{
    console.error(`Job ${job?.id} failed:`, err);
});
