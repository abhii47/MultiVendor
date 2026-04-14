import { Sequelize,Op } from "sequelize";
import { User,Product,Order,Orderitem, Review } from "../models";

export const adminDash = async() => {
    const totalUser = await User.count();
    const totalProduct = await Product.count();
    const totalDeliverOrder = await Order.count({where:{status:'Delivered'}});
    const totalPendingOrder = await Order.count({where:{status:'Confirmed'}});
    const vendor = await User.findAll({where:{role:2}});
    const totalVendor = vendor.length;

    //revenue by each vendor
    const vendorRevenue = await User.findAll({
        where:{role:2},
        attributes:[
            'user_id',
            'name',
            [Sequelize.fn('SUM',Sequelize.literal('`Products->Orderitems`.`quantity` * `Products`.`price`')),'totalSell'],
        ],
        include:[
            {
                model:Product,
                attributes:[],
                required:true,
                include:[
                    {
                        model:Orderitem,
                        as:'Orderitems',
                        attributes:[],
                        required:false,
                        include:[
                            {
                                model:Order,
                                attributes:[],
                                where:{status:'Delivered'},
                                required:true,
                            }
                        ]
                    }
                ]
            }
        ],
        group:['User.user_id'],
        order:[['totalSell','DESC']]
    })

    //Purchase price by each user
    const userPurchase = await Order.findAll({
        where:{status:'Delivered'},
        attributes:[
            'user_id',
            [Sequelize.col('User.name'),'name'],
            [Sequelize.fn('SUM',Sequelize.col('total_amount')),'totalPurchase']
        ],
        include:[
            {model:User,attributes:[]}
        ],
        group:['user_id'],
        order:[['totalPurchase','DESC']]
    });

    //Pending order ids
    const orderPending = await Order.findAll({
        where:{status:'Confirmed'},
        attributes:['order_id']
    })

    return{totalUser,totalVendor,totalProduct,totalDeliverOrder,totalPendingOrder,vendorRevenue,userPurchase,orderPending}
}

export const getTopSellProducts = async() => {
    const orderitems = await Orderitem.findAll({
        attributes:[
            'product_id',
            [Sequelize.col('Product.name'),'name'],
            [Sequelize.fn('SUM',Sequelize.col('Orderitem.quantity')),'totalquantity'],
            [Sequelize.fn('SUM',Sequelize.literal('Orderitem.quantity * Product.price')),'totalPrice'],
            [Sequelize.col('Product.User.name'),'vendor'],
        ],
        include:[
            {
                model:Product,
                attributes:[],
                include:[
                    {model:User,attributes:[]}
                ]
            },
            {
                model:Order,
                attributes:[],
                where:{status:'Delivered'}
            }
        ],
        group:['product_id'],
        order:[['totalquantity','DESC']]
    });
    return orderitems;
}

export const getTopRatedProducts = async() => {
    const products = Product.findAll({
        attributes:[
            'product_id',
            'name',
            [Sequelize.fn('AVG',Sequelize.col('Reviews.rating')),'Rating'],
            [Sequelize.col('User.name'),'Vendor']
        ],
        include:[
            {
                model:Review,
                as:'Reviews',
                attributes:[],
                where:{rating:{[Op.ne]:null}}
            },
            {
                model:User,
                attributes:[]
            }
        ],
        group:['product_id'],
        order:[['Rating','DESC']]
    });
    return products;
}



export default {adminDash,getTopSellProducts,getTopRatedProducts}