import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';
import { getEnv } from '../config/env';

const isProduction = process.env.NODE_ENV === 'production';

const loggerTransports:any[] = [];

//*********************** For Dev *****************
if(!isProduction){
    loggerTransports.push(
        new winston.transports.Console({
            format:winston.format.simple(),
        }),
        new winston.transports.File({
            filename:'logs/dev.log',
        })
    );
}

//*********************** For Production *****************
if(isProduction){
    loggerTransports.push(
        new winston.transports.File({
            filename:'logs/prod.log',
        }),
        new WinstonCloudwatch({
            logGroupName:'MultiVendorAppLogs',
            logStreamName:'prod-logs',
            awsRegion:getEnv('AWS_REGION'),
            jsonMessage:true,
        }),
    );
}


//*********************** Create Logger *****************
const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports:loggerTransports,
});

export default logger;