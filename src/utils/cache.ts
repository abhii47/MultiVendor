import redis from "../config/redis";
import logger from "./logger";

//Get Cache
export const getCache = async(key:string) => {
    try {
        const data = await redis.get(key);
        return data?JSON.parse(data):null;
    } catch (err:any) {
        logger.error(`Error occurred while fetching cache for key: ${key}`, err);
    }
};

//Set Cache
export const setCache = async(key:string,value:any,ttl=120) => {
    try {
        await redis.set(key,JSON.stringify(value),'EX',ttl);
    } catch (err:any) {
        logger.error(`Error occurred while setting cache for key: ${key}`, err);
    }
};

//Delete cache
export const deleteCache = async(key:string) => {
    try {
        if(key.includes('*')){
            const matchedKeys:string[] = [];
            const stream = redis.scanStream({
                match:key,
                count:100,
            });

            for await (const keys of stream){
                const keyBatch = keys as string[];
                if(keyBatch.length > 0){
                    matchedKeys.push(...keyBatch);
                }
            }

            if(matchedKeys.length > 0){
                await redis.del(...matchedKeys);
            }
            return;
        }

        await redis.del(key);
    } catch (err:any) {
        logger.error(`Error occurred while deleting cache for key: ${key}`, err);
    }
};
