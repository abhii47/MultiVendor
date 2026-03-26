import { Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from "sequelize";
import sequelize from "../config/db";
import User from "./userModel";

class RefreshToken extends Model<InferAttributes<RefreshToken>,InferCreationAttributes<RefreshToken>>{
    declare token_id: CreationOptional<number>;
    declare token:string;
    declare expires_in:Date;
    declare user_id: number;
}

RefreshToken.init({
    token_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    token:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    expires_in:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'user_id'
        }
    }
},{
    modelName:'RefreshToken',
    tableName:'refresh_token',
    sequelize,
    indexes:[
        {fields:['user_id'],unique:true}
    ]
});

export default RefreshToken;