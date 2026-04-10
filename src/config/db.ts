import { Sequelize } from "sequelize";
import ApiError from "../utils/apiError";
import { getEnv, loadEnv } from "./env";

loadEnv();

const db: string = getEnv("DB_NAME");
const user: string = getEnv("DB_USER");
const pass: string = getEnv("DB_PASS");
const host: string = getEnv("DB_HOST");
const port: number = Number(getEnv("DB_PORT"));
const env = getEnv("NODE_ENV");

if(!db || !user || !pass || !host){
    throw new ApiError("Environment variable missing",500);
}

const sequelize = new Sequelize(db,user,pass,{
    host,
    port,
    dialect:'mysql',
    logging:env === "development" ? console.log : false,
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
    },
    retry: {
        max: 3,
    },
    dialectOptions:
    env === "production"
        ? {
            ssl: {
            require: true,
            rejectUnauthorized: false,
            },
        }
        : {},
});

export default sequelize;
