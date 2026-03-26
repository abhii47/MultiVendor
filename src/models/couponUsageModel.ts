import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class CouponUsage extends Model<InferAttributes<CouponUsage>,InferCreationAttributes<CouponUsage>>{
    declare usage_id:CreationOptional<number>;
    declare coupon_id:number;
    declare user_id:number;
}

CouponUsage .init({
    usage_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    coupon_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    sequelize,
    modelName:'CouponUsage',
    tableName:'coupon_usage',
    indexes:[
        {
            unique:true,
            fields:['coupon_id','user_id']
        }
    ]
});

export default CouponUsage ;