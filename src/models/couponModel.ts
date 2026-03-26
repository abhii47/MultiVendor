import { Model,InferAttributes,InferCreationAttributes,CreationOptional, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Coupon extends Model<InferAttributes<Coupon>,InferCreationAttributes<Coupon>>{
    declare coupon_id:CreationOptional<number>;
    declare coupon_code:string;
    declare coupon_type:'Percentage'|'Fixed';
    declare amount:number;
    declare max_user_limit:number;
    declare user_id:number;
    declare expiry_date:Date;
}

Coupon.init(
    {
        coupon_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        coupon_code:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        coupon_type:{
            type:DataTypes.ENUM('Percentage','Fixed'),
            allowNull:false,
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                min:1
            }
        },
        max_user_limit:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        expiry_date:{
            type:DataTypes.DATE,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'Coupon',
        tableName:'coupons',
        paranoid:true,
        indexes:[
            {fields:['coupon_code'],unique:true},
            {fields:['user_id']},
            {fields:['expiry_date']},
            {fields:['coupon_code','expiry_date']}
        ]
    }
);

export default Coupon;