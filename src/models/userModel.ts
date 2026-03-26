import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';

class User extends Model<InferAttributes<User>,InferCreationAttributes<User>>{
    declare user_id:CreationOptional<number>;
    declare name:string;
    declare email:string;
    declare password:string;
    declare role:number;
}

User.init({
    user_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{
    modelName:'User',
    tableName:'users',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['user_id']},
        {fields:['email'],unique:true}
    ]
});

export default User;