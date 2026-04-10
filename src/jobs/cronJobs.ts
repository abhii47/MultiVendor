import cron from 'node-cron';
import { Op } from 'sequelize';
import { Otp, RefreshToken } from '../models';
import { autoCancelExpiredPendingOrders } from '../services/orderService';
import logger from '../utils/logger';

const runAutoCancelJob = async () => {
    const timestamp = new Date().toISOString();

    try {
        const cancelledOrderIds = await autoCancelExpiredPendingOrders();
        logger.info("Auto-cancel checked", {
            timestamp,
            cancelledCount: cancelledOrderIds.length,
            cancelledOrderIds,
        });
    } catch (error) {
        logger.error("Auto-cancel failed", {
            timestamp,
            error,
        });
    }
};

const runExpiredOtpCleanupJob = async () => {
    const timestamp = new Date().toISOString();

    try {
        const deletedCount = await Otp.destroy({
            where: {
                expires_in: {
                    [Op.lt]: new Date(),
                },
            },
        });

        logger.info("Expired OTP cleanup checked", {
            timestamp,
            deletedCount,
        });
    } catch (error) {
        logger.error("Expired OTP cleanup failed", {
            timestamp,
            error,
        });
    }
};

const runExpiredRefreshTokenCleanupJob = async () => {
    const timestamp = new Date().toISOString();

    try {
        const deletedCount = await RefreshToken.destroy({
            where: {
                expires_in: {
                    [Op.lt]: new Date(),
                },
            },
        });

        logger.info("Expired refresh-token cleanup checked", {
            timestamp,
            deletedCount,
        });
    } catch (error) {
        logger.error("Expired refresh-token cleanup failed", {
            timestamp,
            error,
        });
    }
};

export const startCronJobs = () => {
    cron.schedule('*/10 * * * *', runAutoCancelJob);
    cron.schedule('*/10 * * * *', runExpiredOtpCleanupJob);
    cron.schedule('0 0 * * *', runExpiredRefreshTokenCleanupJob);
};
