import { Model,InferAttributes,InferCreationAttributes,CreationOptional, DataTypes } from "sequelize";
import sequelize from "../config/db";

class StripeCustomer extends Model<InferAttributes<StripeCustomer>,InferCreationAttributes<StripeCustomer>>{
    declare id:CreationOptional<number>;
    declare stripe_customer_id:string;
    declare user_id:number;
}

StripeCustomer.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        stripe_customer_id:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    },{
        sequelize,
        modelName:'StripeCustomer',
        tableName:'stripe_customer',
        paranoid:true,
    }
);

export default StripeCustomer;