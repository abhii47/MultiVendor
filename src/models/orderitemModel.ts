import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Orderitem extends Model<InferAttributes<Orderitem>,InferCreationAttributes<Orderitem>>{
    declare orderitem_id:CreationOptional<number>;
    declare order_id:number;
    declare product_id:number;
    declare quantity:number;
    declare unit_price:number;
    declare total_amount:number;
    declare status:'Pending'|'Confirmed'|'Cancelled'|'Delivered';
    declare refunded_amount:CreationOptional<number>;

    declare amount?:number;  //inside vendordashboard

}

Orderitem.init({
    orderitem_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    order_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    unit_price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
    },
    total_amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
    },
    status:{
        type:DataTypes.ENUM('Pending','Confirmed','Cancelled','Delivered'),
        defaultValue:'Pending',
    },
    refunded_amount:{
        type:DataTypes.DECIMAL(10,2),
        defaultValue:0.00
    }

},{
    modelName:'Orderitem',
    tableName:'orderitems',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['order_id']},
        {fields:['product_id']},
        {fields:['order_id','product_id']}
    ]
});

export default Orderitem;