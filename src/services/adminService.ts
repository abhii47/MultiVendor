import { Sequelize,Op } from "sequelize";
import { User,Product,Order,Orderitem, Review, StripeCustomer } from "../models";
// import { stripe } from "../config/stripe";
// import ApiError from "../utils/apiError";

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

//dummy just add old user in stripeCustomer table
// export const oldUserInStripe = async() => {
//     try {
//         const user = await StripeCustomer.findAll({
//             attributes:['user_id'],
//         });
//         const userIds = user.map(p=>p.user_id);

//         const oldUser = await User.findAll({
//             where:{user_id:{[Op.notIn]:userIds},role:3}
//         });

//         for(const user of oldUser){
//             const createCustomer = await stripe.customers.create({
//                 name:user.name,
//                 email:user.email
//             });
//             await StripeCustomer.create({
//                 stripe_customer_id:createCustomer.id,
//                 user_id:user.user_id
//             });
//         }
//         return true;
//     } catch (err) {
//         throw new ApiError("Converting doesn't happen",400);
//     }
// }



export default {adminDash,getTopSellProducts,getTopRatedProducts}