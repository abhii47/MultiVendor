import {Model,DataTypes,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize';
import sequelize from '../config/db';
import Refund from './refundModel';
import Orderitem from './orderitemModel';

class RefundItem extends Model<InferAttributes<RefundItem>,InferCreationAttributes<RefundItem>>{
    declare refund_item_id:CreationOptional<number>;
    declare refund_id:number;
    declare orderitem_id:number;
    declare amount:number;
}

RefundItem.init({
    refund_item_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    refund_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Refund,
            key:'refund_id'
        }
    },
    orderitem_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Orderitem,
            key:'orderitem_id'
        }
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    }
},{
    modelName:'RefundItem',
    tableName:'refund_items',
    sequelize,
    paranoid:true,
    indexes:[
        {fields:['refund_id']},
        {fields:['orderitem_id']},
        {fields:['refund_id','orderitem_id']}
    ]
});

export default RefundItem;
