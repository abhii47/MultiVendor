import cron from 'node-cron';
import { autoCancelExpiredPendingOrders } from '../services/orderService';

const runAutoCancelJob = () => {
    const timestamp = new Date().toISOString();

    autoCancelExpiredPendingOrders()
        .then((cancelledOrderIds) => {
            console.log(
                `[cron] Auto-cancel checked at ${timestamp}. Cancelled pending orders: ${cancelledOrderIds.length}`,
                cancelledOrderIds
            );
        })
        .catch((error) => {
            console.error(`[cron] Auto-cancel failed at ${timestamp}`, error);
        });
};

export const startCronJobs = () => {
    cron.schedule('* * * * *', runAutoCancelJob);
};
