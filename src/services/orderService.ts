import { Op, Sequelize } from "sequelize";
import { Cart, Cartitem, Coupon, Couponitem, CouponUsage, Order,Orderitem, Product, StripeCustomer } from "../models";
import ApiError from "../utils/apiError";
import sequelize from "../config/db";
import { createCharge, saveCardToCustomer } from "./stripeService";
import UserCard from "../models/userCardModel";

enum OrderStatus {
    PENDING = 'Pending',
    CONFIRM = 'Confirmed',
    CANCEL = 'Cancelled',
    DELIVER = 'Delivered'

}

export const createOrder = async(userId:number,couponCode?:string) => {

    const result = await sequelize.transaction(async(t)=>{
        
        //check existence of the coupon
        let coupon;
        if(couponCode){
            coupon = await Coupon.findOne({
                where:{coupon_code:couponCode},
                transaction:t,
                lock:t.LOCK.UPDATE
            });
            if(!coupon)throw new ApiError("Coupon Code not found",404);
            if(coupon.expiry_date < new Date(Date.now()) || coupon.max_user_limit === 0){
                throw new ApiError("Coupon Not valid anymore",400);
            };
            //check user already apply this coupon before or not
            const alreadyUsed = await CouponUsage.findOne({
                where:{coupon_id:coupon.coupon_id,user_id:userId},
                transaction:t,
                lock:t.LOCK.UPDATE
            });
            if(alreadyUsed) throw new ApiError("You have already used this coupon",403);
        }

        //get cart first
        const cart = await Cart.findOne({
            where:{user_id:userId},
            transaction:t,
            lock:t.LOCK.UPDATE
        });
        if(!cart) throw new ApiError("Your Cart is empty",400);

        
        //fetch all cartitems
        const cartitems = await Cartitem.findAll({
            where:{cart_id:cart.cart_id},
            attributes:[
                'cartitem_id',
                'product_id',
                'cart_id',
                'quantity',
                [Sequelize.literal('Product.price*Cartitem.quantity'),'productPrice'],
            ],
            include:[{model:Product,attributes:[]}],
            transaction:t,
            lock:t.LOCK.UPDATE
        });
        if(cartitems.length == 0)throw new ApiError("Your Cart is empty",400);

       //all the cartitems needs to belong to couponitems
       if(coupon){
            for(const item of cartitems){
                const couponitem = await Couponitem.findOne({
                    where:{product_id:item.product_id,coupon_id:coupon.coupon_id},
                    transaction:t
                });
                if(!couponitem) throw new ApiError("Coupon Can't used on this order",400);
            }
       }

        //check the stock before order create
        for(const item of cartitems){
            const product = await Product.findByPk(item.product_id,{
                transaction:t,
                lock:t.LOCK.UPDATE
            });
            if(!product)  throw new ApiError("Out Of Stock",400); //not execute normally
            if(product.quantity<item.quantity){
                throw new ApiError(`${product.name} Out Of Stock`,400);
            }
        }


        //calculate total amount
        let totalAmount:number = 0;
        for(const item of cartitems){
            totalAmount += Number(item.dataValues.productPrice || 0); 
        } 

        //calculation after applying coupon
        if(coupon){
            if(coupon.coupon_type === 'Percentage'){
                totalAmount -= (totalAmount*(coupon.amount/100));
            }else{totalAmount = totalAmount-coupon.amount;}
        }
        
        //create a order
        const order = await Order.create({
            user_id:userId,
            total_amount:totalAmount,
            status:OrderStatus.PENDING,
        },{transaction:t});

        //data for orderitems
        const orderData = cartitems.map((item)=>({
                order_id:order.order_id,
                product_id:item.product_id,
                quantity:item.quantity,
        }))
         
        if(coupon){
            coupon.max_user_limit -= 1
            await coupon.save({transaction:t});

            await CouponUsage.create({
                coupon_id:coupon.coupon_id,
                user_id:userId,
            },{transaction:t});
        }
        
        //store all the cart items inside order items
        await Orderitem.bulkCreate(orderData,{transaction:t});


        //update the product quantity
        for(const item of cartitems){
            await Product.update(
                {
                    quantity:Sequelize.literal(`quantity - ${item.quantity}`),
                },
                {where:{product_id:item.product_id},transaction:t}
            );

            //stock is unavailable if stock 0 -> after updating
            const product = await Product.findByPk(item.product_id,{
                transaction:t,
                lock:t.LOCK.UPDATE,
            });
            if(!product) throw new ApiError("Server Error",500);
            if(product.quantity <= 0){
                product.is_available = false;
                await product.save({transaction:t});
            }
        }
        
        //now clear the user cart
        await Cartitem.destroy({where:{cart_id:cart.cart_id},transaction:t});
        return order;
    });
    return result;
}

export const addCard = async(userId:number) => {
    const result = await sequelize.transaction(async(t)=>{
            const customer = await StripeCustomer.findOne({
            where:{user_id:userId},
            transaction:t,
            lock:t.LOCK.UPDATE
        });
        if(!customer) throw new ApiError('Stripe Customer Not Found',404);

        //Save card to customer's source/paymentmethods
        const saveCard = await saveCardToCustomer(
            customer.stripe_customer_id,
            'tok_visa', //hardcoded testing purpose
        );
        if(!saveCard) throw new ApiError("Card doesn't saved",400);

        //check is there already card exist or not for setting the default card
        const existingCard = await UserCard.count({
            where:{user_id:userId},
            transaction:t,
        });

        //card details saved in DB
        const card = await UserCard.create({
            user_id:userId,
            card_id:saveCard.id,
            brand:saveCard.brand,
            last4:saveCard.last4,
            exp_year:saveCard.exp_year,
            exp_month:saveCard.exp_month,
            is_default:existingCard === 0    
        },{transaction:t});

        return card;
    })
    return result;
}

type paymentBody = {
    orderId:number,
    cardId?:number,
}
export const createPayment = async(userId:number,body:paymentBody) => { 
    const result = await sequelize.transaction(async(t)=>{
        const {orderId,cardId} = body;
    
        //find order exist or not
        const order = await Order.findOne({
            where:{
                order_id:orderId,
                user_id:userId,
            },
            transaction:t,
            lock:t.LOCK.UPDATE
        });
        if(!order) throw new ApiError("Order Not Found",404);
        
        //check payment already made or not
        if(order.charge_id) throw new ApiError("Order already paid!",400);

        // also check the status if that order cancelled then 
        if(order.status !== OrderStatus.PENDING) throw new ApiError("Order can.t be paid",400);

        //customer have stripe id exist or not
        const customer = await StripeCustomer.findOne({
            where:{user_id:userId},
            transaction:t,
        });
        if(!customer) throw new ApiError("Customer Has no stripe account",400);

        //get card now 
        const whereCondition = cardId?
                    {card_id:cardId,user_id:userId}
                    :{is_default:true,user_id:userId}
        const card = await UserCard.findOne({
            where:whereCondition,
            transaction:t,
            lock:t.LOCK.UPDATE,
        });
        if(!card) throw new ApiError("No card found,Please add card details...",404);

        //now charge the amount
        let charge;
        try {
            charge = await createCharge(order.total_amount,card.card_id,customer.stripe_customer_id);
        } catch (err) {
            throw new ApiError("Payment failed",400);
        }

        if(charge.status === 'succeeded'){
            order.charge_id = charge.id,
            order.status = OrderStatus.CONFIRM;
            await order.save({transaction:t});
            return order;
        }
        throw new ApiError("Payment Failed,Please try again later",400);
    });
    return result;
}

export const getOrder = async(userId:number) => {
    const result = await sequelize.transaction(async(t)=>{
        //get the user's order
        const orders = await Order.findAll({
            where:{user_id:userId},
            attributes:[
                'order_id', 
                'total_amount',
                'status',
            ],
            include:[
                {
                    model:Orderitem,
                    attributes:[
                        'quantity',
                        [Sequelize.literal('`Orderitems->Product`.`price` * `Orderitems`.`quantity`'),'Price']
                    ],
                    include:[
                        {
                            model:Product,
                            attributes:['product_id','name'],
                        }
                    ]
                }
            ],
            transaction:t,
        });
        return orders;
    });
    return result;
}

export const cancelOrder = async(userId:number,orderId:number) => {
    const result = await sequelize.transaction(async(t)=>{

        //check user has that order or not and only pending order can be cancelled
        const order = await Order.findOne({
            where:{
                user_id:userId,
                order_id:orderId,
                status:{[Op.or]:[OrderStatus.PENDING]}
            },
            attributes:['order_id','total_amount','status'],
            transaction:t,
            lock:t.LOCK.UPDATE,
        });
        if(!order) throw new ApiError('Order Not exist',400);

        //change the status
        order.status = OrderStatus.CANCEL;
        await order.save({transaction:t});
        
        //fetch all the items of that order
        const orderitems = await Orderitem.findAll({
            where:{order_id:order.order_id},
            transaction:t,
            lock:t.LOCK.UPDATE,
        });

        //product quantity update again
        for(const item of orderitems){
            //find each product inside orderitems
            const product = await Product.findOne({
                where:{product_id:item.product_id},
                transaction:t,
                lock:t.LOCK.UPDATE,
            });
            if(!product) throw new ApiError("Product not found",404);

            //update the values
            product.quantity += item.quantity
            product.is_available = product.quantity>0;
            await product.save({transaction:t});
        }
        return order;
    });
    return result;
}

export const deliverOrder = async(orderId:number) => {
    const result = await sequelize.transaction(async(t) => {
        
        //check order exist or not  
        const order = await Order.findOne({
            where:{order_id:orderId,status:OrderStatus.CONFIRM},
            attributes:['order_id','total_amount','status'],
            transaction:t,
            lock:t.LOCK.UPDATE,
        });
        if(!order) throw new ApiError('Order Not Found',404);

        order.status = OrderStatus.DELIVER;
        await order.save({transaction:t});

        return order;
    });
    return result;
}

export default {createOrder, addCard, createPayment, getOrder, cancelOrder, deliverOrder};