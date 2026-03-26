import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';
import User from "./userModel";

class UserCard extends Model<InferAttributes<UserCard>,InferCreationAttributes<UserCard>>{
    declare user_card_id:CreationOptional<number>;
    declare user_id:number;
    declare card_id:string;
    declare brand:string;
    declare last4:string;
    declare exp_month:number;
    declare exp_year:number;
    declare is_default:CreationOptional<boolean>;
}

UserCard.init({
    user_card_id:{
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
    card_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    brand:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last4:{
        type:DataTypes.STRING,
        allowNull:false
    },
    exp_month:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    exp_year:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    is_default:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    }
},{
    sequelize,
    modelName:'UserCard',
    tableName:'user_cards',
    paranoid:true,
    indexes:[{fields:['user_id'],unique:true}]
})

export default UserCard;