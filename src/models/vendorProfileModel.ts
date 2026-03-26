import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';
import User from './userModel';

class VendorProfile extends Model<InferAttributes<VendorProfile>,InferCreationAttributes<VendorProfile>>{
    declare profile_id:CreationOptional<number>;
    declare user_id:number;
    declare shop_name:string;
    declare city:string;
    declare state:string;
    declare status:"Not Verified" | "Verified";
}

VendorProfile.init({
    profile_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true,
        references:{
            model:User,
            key:'user_id'
        }
    },
    shop_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM("Not Verified","Verified"),
        allowNull:false,
    }
},{
    modelName:'VendorProfile',
    tableName:'vendor_profile',
    sequelize,
    indexes:[
        {fields:['user_id'],unique:true}
    ]
});

export default VendorProfile;