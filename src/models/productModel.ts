import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Product extends Model<InferAttributes<Product>,InferCreationAttributes<Product>>{
    declare product_id:CreationOptional<number>;
    declare name:string;
    declare category_id:number;
    declare user_id:number;
    declare price:number;
    declare is_available:CreationOptional<boolean>;
    declare quantity:number;
    declare filename:string;
}

Product.init({
    product_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    is_available:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    filename:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},{
    modelName:'Product',
    tableName:'products',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['user_id']},
        {fields:['category_id']},
        {fields:['category_id','is_available']}
    ]
});

export default Product;