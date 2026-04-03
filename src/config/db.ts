import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import ApiError from "../utils/apiError";

const envFile = 
process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development';
dotenv.config({path:envFile});

const db:string = process.env.DB_NAME!;
const user:string = process.env.DB_USER!;
const pass:string = process.env.DB_PASS!;
const host:string = process.env.DB_HOST!;
const port:number = Number(process.env.DB_PORT) || 3306;

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
