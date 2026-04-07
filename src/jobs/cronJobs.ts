import cron from 'node-cron';
import { autoCancelExpiredPendingOrders } from '../services/orderService';
import logger from '../utils/logger';

const runAutoCancelJob = () => {
    const timestamp = new Date().toISOString();

    autoCancelExpiredPendingOrders()
        .then((cancelledOrderIds) => {
            logger.info("Auto-cancel checked", {
                timestamp,
                cancelledCount: cancelledOrderIds.length,
                cancelledOrderIds,
            });
        })
        .catch((error) => {
            logger.error("Auto-cancel failed", {
                timestamp,
                error,
            });
        });
};

export const startCronJobs = () => {
    cron.schedule('* * * * *', runAutoCancelJob);
};
