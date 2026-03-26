import { Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from "sequelize";
import sequelize from "../config/db";

class Cart extends Model<InferAttributes<Cart>,InferCreationAttributes<Cart>>{
    declare cart_id: CreationOptional<number>;
    declare user_id:number;
}

Cart.init({
    cart_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    },
},{
    modelName:'Cart',
    tableName:'carts',
    sequelize,
    indexes:[
        {fields:['user_id'],unique:true}
    ]
});

export default Cart;