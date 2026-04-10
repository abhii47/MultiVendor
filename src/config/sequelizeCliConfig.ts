import { getEnv } from "./env";

const baseConfig = {
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASS"),
    database: getEnv("DB_NAME"),
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    dialect: "mysql",
    logging: false,
};

const config = {
    development: { ...baseConfig },
    production: { ...baseConfig },
    test: { ...baseConfig },
};

export = config;
