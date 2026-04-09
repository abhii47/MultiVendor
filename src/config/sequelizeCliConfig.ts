import { loadEnv } from "./env";

loadEnv();

const requiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const baseConfig = {
    username: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASS"),
    database: requiredEnv("DB_NAME"),
    host: requiredEnv("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql" as const,
    logging: false,
};

const config = {
    development: { ...baseConfig },
    production: { ...baseConfig },
    test: { ...baseConfig },
};

export = config;
