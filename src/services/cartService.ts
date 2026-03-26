import { Cart,Cartitem, Product } from "../models";
import ApiError from "../utils/apiError";

type addCartBody = {
    productId:number;
    quantity:number;
}
export const addCart = async(body:addCartBody,userId:number) => {

    const {productId,quantity} = body;

    //fetch the product first
    const product = await Product.findOne({where:{product_id:productId}});
    if(!product) throw new ApiError('Product not exist',400);
    if(!product.is_available) throw new ApiError("Product isn't available",400);

    //If cart not exist then create new
    const [cart,created] = await Cart.findOrCreate({
        where:{user_id:userId},
        defaults:{
            user_id:userId
        }
    });

    //check product existence with same user's cart
    const checkItem = await Cartitem.findOne({
        where:{product_id:productId,cart_id:cart.cart_id}
    });
    
    if(checkItem){
        //remain stock
        const stock = product.quantity-checkItem.quantity;
        
        //increment product quantity
        checkItem.quantity += quantity;

        //check if existing quantity less than added quantity
        if(checkItem.quantity > product.quantity){
            throw new ApiError(`${stock} stock left only`,400);
        }

        //save in DB
        await checkItem.save();
        return checkItem;
    }else{

        //check if existing quantity less than added quantity
        if(quantity > product.quantity){
            throw new ApiError(`${product.quantity} stock left only`,400);
        }

        //add product in cartitems
        const cartItem = await Cartitem.create({
            product_id:productId,
            cart_id:cart.cart_id,
            quantity
        });
        return cartItem;
    }
}

export const getCart = async(userId:number) => {
    //check cart exist or not
    const cart = await Cart.findOne({where:{user_id:userId}});
    if(!cart) throw new ApiError("No Product in cart",404);

    //check if there any items in cart
    const cartItem = await Cartitem.findAll({
        where:{cart_id:cart.cart_id},
        include:{model:Product,attributes:['price']}
    });
    if(cartItem.length === 0) throw new ApiError("No Product in cart",404);

    let total = 0;
    let count = 0;
    //find total amount of the product using forEach
    cartItem.forEach(item=>{
        if(item.Product){
            const price = item.Product?.price;
            const quantity = item.quantity;
            total+=price * quantity;
            count++;
        }
    })

    return {cartItem,total,count};
}

export const removeCart = async(userId:number,cartitemId:number) => {

    //fetch cart of current user
    const cart = await Cart.findOne({where:{user_id:userId}});
    if(!cart) throw new ApiError("Your cart is empty",400);

    //check given item exist or not in loggedIn user's cart
    const existItem = await Cartitem.findOne({where:{cartitem_id:cartitemId,cart_id:cart.cart_id}});
    if(!existItem) throw new ApiError("Product not exist",400);

    //if exist then delete
    await existItem.destroy();
}

export default {addCart,getCart,removeCart}