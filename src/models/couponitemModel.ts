import { Model,InferAttributes,InferCreationAttributes,CreationOptional, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Couponitem extends Model<InferAttributes<Couponitem>,InferCreationAttributes<Couponitem>>{
    declare couponitem_id:CreationOptional<number>;
    declare coupon_id:number;
    declare product_id:number;
}

Couponitem.init(
    {
        couponitem_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        coupon_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    },{
        sequelize,
        modelName:'Couponitem',
        tableName:'couponitems',
        paranoid:true,
        indexes:[
            {fields:['coupon_id']},
            {fields:['product_id']},
            {fields:['coupon_id','product_id'],unique:true}
        ]
    }
);

export default Couponitem;