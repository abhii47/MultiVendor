import { Redis } from 'ioredis';
import { getEnv } from './env';

const redis = new Redis(getEnv('REDIS_URL'));

export default redis;