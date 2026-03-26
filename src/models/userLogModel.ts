import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';
import User from "./userModel";

class Userlog extends Model<InferAttributes<Userlog>,InferCreationAttributes<Userlog>>{
    declare log_id:CreationOptional<number>;
    declare user_id:number;
    declare status:"Success"|"Failed";
    declare is_logout:CreationOptional<boolean>;
    declare user_ip:string;
}

Userlog.init({
    log_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'user_id'
        }
    },
    status:{
        type:DataTypes.ENUM("Success","Failed"),
        allowNull:false
    },
    is_logout:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    user_ip:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    modelName:'Userlog',
    tableName:'user_login_logs',
    sequelize,
})

export default Userlog;