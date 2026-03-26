import { Op, Sequelize } from "sequelize";
import { Couponitem,Coupon, User, Product } from "../models";
import ApiError from "../utils/apiError";
import { uniqueCouponCode } from "../utils/generator";

type couponBody = {
    coupon_type:'Percentage'|'Fixed';
    amount:number;
    max_user:number;
    products:number[];
    expiry:Date;
}
export const createCoupon = async(userId:number,roleId:number,body:couponBody) => {
    const {coupon_type,amount,max_user,products,expiry} = body;
    
    //for vendor only
    if(roleId == 2){
        //get all the products of user
        const vendorProducts = await Product.findAll({where:{user_id:userId},attributes:['product_id']});
        const productIds = vendorProducts.map(p=>p.product_id);
        //check ownership of products
        for(const items of products){
            if(!productIds.includes(items)){
                throw new ApiError("You Can't Apply Coupon on this products",403);
            }
        };
    }

    //amount validates
    if(coupon_type === 'Percentage'){
        if(amount>100 || amount<=0) throw new ApiError("Percentage Invalid",422);
    }

    //unique coupon code generated
    const couponCode = uniqueCouponCode();

    //create the coupon
    const coupon = await Coupon.create({
        coupon_code:couponCode,
        coupon_type,
        amount,
        max_user_limit:max_user,
        user_id:userId,
        expiry_date:expiry,
    });

    //Also add the items on DB on which couponCode applied
    for(const items of products){
        await Couponitem.create({coupon_id:coupon.coupon_id,product_id:items});        
    };

    return coupon;
}

export const deleteCoupon = async(userId:number,couponId:number) => {

    const coupon = await Coupon.findOne({where:{coupon_id:couponId,user_id:userId}});
    if(!coupon) throw new ApiError("Coupon not found",404);

    await coupon.destroy();
    await Couponitem.destroy({where:{coupon_id:couponId}});

    return coupon.coupon_code;
}

export default {createCoupon,deleteCoupon};