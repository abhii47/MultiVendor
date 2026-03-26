import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Order extends Model<InferAttributes<Order>,InferCreationAttributes<Order>>{
    declare order_id:CreationOptional<number>;
    declare user_id:number;
    declare total_amount:number;
    declare status:'Pending'|'Confirmed'|'Cancelled'|'Delivered';
    declare charge_id:CreationOptional<string>;
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
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('Pending','Confirmed','Cancelled','Delivered'),
        defaultValue:'Pending'
    },
    charge_id:{
        type:DataTypes.STRING,
        allowNull:true
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