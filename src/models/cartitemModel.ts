import { Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from "sequelize";
import sequelize from "../config/db";
import Product from "./productModel";

class Cartitem extends Model<InferAttributes<Cartitem>,InferCreationAttributes<Cartitem>>{
    declare cartitem_id: CreationOptional<number>;
    declare product_id:number;
    declare cart_id:number;
    declare quantity:number;

    declare Product?:Product;
    declare productPrice?:number;
}

Cartitem.init({
    cartitem_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    cart_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{
    modelName:'Cartitem',
    tableName:'cartitems',
    sequelize,
    indexes:[
        {fields:['cart_id']},
        {fields:['product_id','cart_id'],unique:true}
    ]
});

export default Cartitem;