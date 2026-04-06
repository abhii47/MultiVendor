import { Sequelize } from "sequelize";
import ApiError from "../utils/apiError";
import { getEnv, loadEnv } from "./env";

loadEnv();

const db: string = getEnv("DB_NAME");
const user: string = getEnv("DB_USER");
const pass: string = getEnv("DB_PASS");
const host: string = getEnv("DB_HOST");
const port: number = Number(process.env.DB_PORT) || 3306;

if(!db || !user || !pass || !host){
    throw new ApiError("Environment variable missing",500);
}

const sequelize = new Sequelize(db,user,pass,{
    host,
    port,
    dialect:'mysql',
    logging:false
});

export default sequelize;
