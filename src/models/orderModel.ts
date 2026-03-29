import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Order extends Model<InferAttributes<Order>,InferCreationAttributes<Order>>{
    declare order_id:CreationOptional<number>;
    declare user_id:number;
    declare total_amount:number;
    declare payment_status:'Pending'|'Paid'|'PartiallyRefunded'|'Refunded';
    declare refunded_amount:CreationOptional<number>;
    declare status:'Pending'|'Confirmed'|'Cancelled'|'Delivered'|'Returned';
    declare charge_id:CreationOptional<string>;
    declare coupon_id:CreationOptional<number>;
}

Order.init({
    order_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    total_amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    payment_status:{
        type:DataTypes.ENUM('Pending','Paid','PartiallyRefunded','Refunded'),
        defaultValue:'Pending'
    },
    refunded_amount:{
        type:DataTypes.DECIMAL(10,2),
        defaultValue:0.00
    },
    status:{
        type:DataTypes.ENUM('Pending','Confirmed','Cancelled','Delivered','Returned'),
        defaultValue:'Pending'
    },
    charge_id:{
        type:DataTypes.STRING,
        allowNull:true
    },
    coupon_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
    }
},{
    modelName:'Order',
    tableName:'orders',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['user_id']},
        {fields:['status']},
        {fields:['user_id','status']},
        {fields:['createdAt']}
    ]
});

export default Order;