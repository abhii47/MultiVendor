import { Model,InferAttributes,InferCreationAttributes,CreationOptional, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Review extends Model<InferAttributes<Review>,InferCreationAttributes<Review>>{
    declare review_id:CreationOptional<number>;
    declare product_id:number;
    declare user_id:number;
    declare rating:number;
    declare comment:string;
    declare is_verified_purchase:CreationOptional<boolean>;
    declare image_url:CreationOptional<string>;
}

Review.init({
    review_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1,
            max:5
        }
    },
    comment:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    is_verified_purchase:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    image_url:{
        type:DataTypes.STRING,
        allowNull:true,
    }
},{
    sequelize,
    modelName:'Review',
    tableName:'reviews',
    indexes:[
        {fields:['product_id']}
    ]
});

export default Review;