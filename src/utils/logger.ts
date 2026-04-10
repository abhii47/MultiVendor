import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import WinstonCloudWatch from "winston-cloudwatch";
import fs from "fs";
import { getEnv } from "../config/env";

const isProduction = process.env.NODE_ENV === "production";
fs.mkdirSync("logs", { recursive: true });

const {
  combine,
  timestamp,
  printf,
  colorize,
  errors,
  json,
} = winston.format;

// 👉 Pretty format for development
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
   return `
${timestamp} 🔹 ${level}
➡️  ${stack || message}
${Object.keys(meta).length ? "📦 " + JSON.stringify(meta, null, 2) : ""}
----------------------------------------`;
});

const transports: winston.transport[] = [];

// ================= DEV =================
if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || "debug",
      format: combine(colorize({all:true}), timestamp(), errors({ stack: true }), devFormat),
    }),

    // Optional file (rotated)
    new DailyRotateFile({
      filename: "logs/dev-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d",
      zippedArchive: false, 
    })
  );
}

// ================= PROD =================
if (isProduction) {
  transports.push(
    // Store in CloudWatch
    new WinstonCloudWatch({
      logGroupName: "multivendor-app",
      logStreamName: "backend-logs",
      awsRegion: getEnv("AWS_REGION"),
      awsAccessKeyId:getEnv("AWS_ACCESS_KEY_ID"),
      awsSecretKey:getEnv("AWS_SECRET_ACCESS_KEY"),
      jsonMessage: true,
    }),
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || "info",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    }),
    new DailyRotateFile({
      filename: "logs/prod-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: process.env.LOG_LEVEL || "info",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    })
  );
}

// ================= LOGGER =================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json() // structured logs (prod-friendly)
  ),
  transports,
});

export default logger;