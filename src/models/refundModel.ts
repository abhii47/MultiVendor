import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';
import Order from './orderModel';
import User from './userModel';

class Refund extends Model<InferAttributes<Refund>,InferCreationAttributes<Refund>>{
    declare refund_id:CreationOptional<number>;
    declare order_id:number;
    declare vendor_id?:number;
    declare amount:number;
    declare reason_type:string;
    declare refund_type:'Full'|'Partial';
    declare status:CreationOptional<'Processed'|'Failed'>;
    declare stripe_refund_id:CreationOptional<string>;
}

Refund.init({
    refund_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    order_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Order,
            key:'order_id'
        }
    },
    vendor_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:User,
            key:'user_id'
        }
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    reason_type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    refund_type:{
        type:DataTypes.ENUM('Full','Partial'),
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('Pending','Processed','Failed'),
        defaultValue:'Pending'
    },
    stripe_refund_id:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    modelName:'Refund',
    tableName:'refunds',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['order_id']},
        {fields:['vendor_id']},
        {fields:['status']},
        {fields:['reason_type']}
    ]
});

export default Refund;
