import { Op, Sequelize } from "sequelize";
import { User, VendorProfile } from "../models";
import ApiError from "../utils/apiError";
import { getValue } from "../utils/roleAssign";

type userBody = {
    search?:string,
    role?:'admin'|'vendor'|'user',
    sort?:string,
    page?:number,
    limit?:number
}
export const getUsers = async(body:userBody) => {
    const {search,role,sort,page=1,limit=5} = body;

    //now intialize whereCondition for where clause and order
    const whereCondition:any = {};
    let orderCondition:any = [];
    const roleId = role? getValue(role):undefined;
    
    //assign the values
    if(search)whereCondition.name = {[Op.like]:`%${search}%`};
    if(role)whereCondition.role = roleId;
    if(sort){
        orderCondition = [[`${sort}`,'ASC']];
    }else{ orderCondition = [['createdAt','ASC']];}

    //for pagination
    let offset = Number((page-1)*limit);

    //Query
    const {count,rows} = await User.findAndCountAll({
        limit,
        offset,
        where:whereCondition,
        attributes:['user_id','name','email','role',
            [Sequelize.col('VendorProfile.shop_name'),'shop'],
            [Sequelize.col('VendorProfile.status'),'status']
        ],
        include:[
            {
                model:VendorProfile,
                attributes:[],
            }
        ],
        order:orderCondition
    });
    return {count,rows,page,limit};
}

export const deleteUser = async(userId:number)=>{
    
    //user exist or not
    const existUser = await User.findByPk(userId);
    if(!existUser) throw new ApiError("User Not exist",404);

    //soft delete user
    await existUser.destroy();
}

export default {getUsers,deleteUser}