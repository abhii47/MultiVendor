import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Orderitem extends Model<InferAttributes<Orderitem>,InferCreationAttributes<Orderitem>>{
    declare orderitem_id:CreationOptional<number>;
    declare order_id:number;
    declare product_id:number;
    declare quantity:number;

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