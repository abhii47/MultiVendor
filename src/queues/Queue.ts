import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

export const emailQueue = new Queue("email",{
    connection:createRedisConnection(),
});
export const stripeQueue = new Queue("stripe",{
    connection:createRedisConnection(),
});
export const receiptQueue = new Queue("receipt",{
    connection:createRedisConnection(),
});