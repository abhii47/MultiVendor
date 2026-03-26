import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class Category extends Model<InferAttributes<Category>,InferCreationAttributes<Category>>{
    declare category_id:CreationOptional<number>;
    declare name:string;
}

Category.init({
    category_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    }
},{
    modelName:'Category',
    tableName:'category',
    sequelize,
});

export default Category;