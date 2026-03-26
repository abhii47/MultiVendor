import { Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from "sequelize";
import sequelize from "../config/db";

class Otp extends Model<InferAttributes<Otp>,InferCreationAttributes<Otp>>{
    declare otp_id: CreationOptional<number>;
    declare email:string;
    declare otp:number;
    declare expires_in:Date;
}

Otp.init({
    otp_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    expires_in:{
        type:DataTypes.DATE,
        allowNull:false,
    }
},{
    modelName:'Otp',
    tableName:'otps',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['email'],unique:true}
    ]
});

export default Otp;