import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import ApiError from "../utils/apiError";
dotenv.config();

const db:string = process.env.DB_NAME!;
const user:string = process.env.DB_USER!;
const pass:string = process.env.DB_PASS!;
const host:string = process.env.DB_HOST!;

if(!db || !user || !pass || !host){
    throw new ApiError("Environment variable missing",500);
}

const sequelize = new Sequelize(db,user,pass,{
    host:host,
    dialect:'mysql',
    // logging:true
});

export default sequelize;
