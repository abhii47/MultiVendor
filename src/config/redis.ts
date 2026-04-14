import { Redis } from 'ioredis';
import { getEnv } from './env';

// Singleton — used for caching (cache.ts)
const redis = new Redis(getEnv('REDIS_URL'),{
    maxRetriesPerRequest: null,
});

export default redis;

// Factory — used for BullMQ Queues and Workers (each needs its own connection)
export const createRedisConnection = () =>
    new Redis(getEnv('REDIS_URL'), {
        maxRetriesPerRequest: null,
});