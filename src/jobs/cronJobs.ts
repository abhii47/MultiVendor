import cron from 'node-cron';
import { autoCancelExpiredPendingOrders } from '../services/orderService';

const runSmallTask = () => {
    const timestamp = new Date().toISOString();
    autoCancelExpiredPendingOrders()
        .then((cancelledOrdersCount) => {
            console.log(
                `[cron] Auto-cancel checked at ${timestamp}. Cancelled pending orders: ${cancelledOrdersCount}`
            );
        })
        .catch((error) => {
            console.error(`[cron] Auto-cancel failed at ${timestamp}`, error);
        });
};

export const startCronJobs = () => {
    cron.schedule('* * * * *', runSmallTask);
};
