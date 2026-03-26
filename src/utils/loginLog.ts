import { Transaction } from "sequelize";
import { Userlog } from "../models";

export const userLoginLog = async(
    user_id:number,
    status:"Success" | "Failed",
    user_ip:string,
    is_logout:boolean=false
) =>{ 

    const log = await Userlog.create({
        user_id,
        status,
        user_ip,
        is_logout,
    });
    if(log) console.log('logs added');
}