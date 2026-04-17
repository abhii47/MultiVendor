import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail";
import logger from "../utils/logger";
import { StripeCustomer, User } from "../models";
import { getValue } from "../utils/roleAssign";
import { createCustomer } from "../services/stripeService";
import { createReceipt } from "../services/receiptService";

//*************************************** All Functions **************************************
type StripeJobData = {
    user_id: number;
    name: string;
    email: string;
    role: number;
};
const createStripeCustomer = async(user:StripeJobData) => {
    if(user.role === getValue('user')){
            try {
                const customer = await createCustomer(user.name,user.email);

                //save that customer's stripe id in DB
                await StripeCustomer.create({
                    stripe_customer_id:customer.id,
                    user_id:user.user_id,
                });
                // stripe_customer_id = stripe_customer.stripe_customer_id;
                logger.info(`Stripe customer created for user ${user.email}: ${customer.id}`);
            } catch (err) {
                logger.error("Stripe background job failed:", err);
            }
    }
}

//*************************************** Email Worker ****************************************
export const emailWorker = new Worker("email", async(job) => {
    console.log("Processing job...",job.id);
    
    switch(job.name){
        case "sendOtpEmail":
            await sendOtpEmail(job.data.email,job.data.otp);
            logger.info(`OTP email sent to ${job.data.email}`);
            break;
        case "sendWelcomeEmail":
            await sendWelcomeEmail(job.data.email,job.data.name);
            logger.info(`Welcome email sent to ${job.data.email}`);
            break;
        default:
            logger.warn(`Unknown job type: ${job.name}`);
    }
},{
    connection:createRedisConnection(),
});

//*************************************** Stripe Worker ****************************************
export const stripeWorker = new Worker("stripe", async(job) => {
    console.log("Processing Job...",job.id);

    switch(job.name){
        case "createStripeCustomer":
            await createStripeCustomer(job.data);
            logger.info(`Stripe customer creation job completed for user ${job.data.email}`);
            break;
        default:
            logger.warn(`Unknown job type: ${job.name}`);
    }
},{
    connection:createRedisConnection(),
});

//**************************************** Receipt Worker ******************************************
export const receiptWorker = new Worker("receipt",async(job) => {
    console.log("Processing Job...",job.id);

    switch(job.name){
        case "createReceipt":
            await createReceipt(job.data.orderID);
            logger.info(`Receipt creation job completed for order ${job.data.orderID}`);
            break;
        default:
            logger.warn(`Unknown job type: ${job.name}`);
    }
},{
    connection:createRedisConnection(),
});
