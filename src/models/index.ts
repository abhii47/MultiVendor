import User from "./userModel";
import RefreshToken from "./tokenModel";
import VendorProfile from "./vendorProfileModel";
import Userlog from "./userLogModel";
import Otp from "./otpModel";
import Category from "./categoryModel";
import Product from "./productModel";
import Cart from "./cartModel";
import Cartitem from "./cartitemModel";
import Order from "./orderModel";
import Orderitem from "./orderitemModel";
import Review from "./reviewModel";
import Coupon from "./couponModel";
import Couponitem from "./couponitemModel";
import CouponUsage from "./couponUsageModel";
import StripeCustomer from "./stripeCustmorModel";
import UserCard from "./userCardModel";
import Refund from "./refundModel";
import RefundItem from "./refundItemModel";


//create Association

//user -> refreshtoken (1-N)
User.hasMany(RefreshToken,{foreignKey:'user_id'})
RefreshToken.belongsTo(User,{foreignKey:'user_id'})

//user -> vendorprofile (1-1)
User.hasOne(VendorProfile,{foreignKey:'user_id'})
VendorProfile.belongsTo(User,{foreignKey:'user_id'})

//user -> userlog (1-N)
User.hasMany(Userlog,{foreignKey:'user_id'})
Userlog.belongsTo(User,{foreignKey:'user_id'})

//user(Vendor:2) -> Product (1-N)
User.hasMany(Product,{foreignKey:'user_id'});
Product.belongsTo(User,{foreignKey:'user_id'});

//Category -> Product (1-N)
Category.hasMany(Product,{foreignKey:'category_id'});
Product.belongsTo(Category,{foreignKey:'category_id'});

//User -> Cart (1-1)
User.hasOne(Cart,{foreignKey:'user_id'});
Cart.belongsTo(User,{foreignKey:'user_id'});

//Cart -> Cartitem (1-N)
Cart.hasMany(Cartitem,{foreignKey:'cart_id'});
Cartitem.belongsTo(Cart,{foreignKey:'cart_id'});

//Product -> Cartitem (1-N)
Product.hasMany(Cartitem,{foreignKey:'product_id'});
Cartitem.belongsTo(Product,{foreignKey:'product_id'});

//User -> Order (1-N)
User.hasMany(Order,{foreignKey:'user_id'});
Order.belongsTo(User,{foreignKey:'user_id'});

//Order -> Orderitem (1-N)
Order.hasMany(Orderitem,{foreignKey:'order_id'});
Orderitem.belongsTo(Order,{foreignKey:'order_id'});

//Product -> Ordeitem (1-N)
Product.hasMany(Orderitem,{foreignKey:'product_id',as:'Orderitems'});
Orderitem.belongsTo(Product,{foreignKey:'product_id'});

//Product -> Review (1-N)
Product.hasMany(Review,{foreignKey:'product_id',as:'Reviews'});
Review.belongsTo(Product,{foreignKey:'product_id'});

//User -> Review (1-N)
User.hasMany(Review,{foreignKey:'user_id'});
Review.belongsTo(User,{foreignKey:'user_id'});

//User -> Coupon (1-N)
User.hasMany(Coupon,{foreignKey:'user_id',});
Coupon.belongsTo(User,{foreignKey:'user_id'});

//Coupon -> Couponitem (1-N)
Coupon.hasMany(Couponitem,{foreignKey:'coupon_id'});
Couponitem.belongsTo(Coupon,{foreignKey:'coupon_id'});

//Product -> Couponitem (1-N)
Product.hasMany(Couponitem,{foreignKey:'product_id'});
Couponitem.belongsTo(Product,{foreignKey:'product_id'});

//User -> CouponUsage (1-N)
User.hasMany(CouponUsage,{foreignKey:'user_id'});
CouponUsage.belongsTo(User,{foreignKey:'user_id'});

//Coupon -> CouponUsage (1-N)
Coupon.hasMany(CouponUsage,{foreignKey:'coupon_id'});
CouponUsage.belongsTo(Coupon,{foreignKey:'coupon_id'});

//User -> StripeCustomer (1-1)
User.hasOne(StripeCustomer,{foreignKey:'user_id'});
StripeCustomer.belongsTo(User,{foreignKey:'user_id'});

//User -> UserCard (1-N)
User.hasMany(UserCard,{foreignKey:'user_id'});
UserCard.belongsTo(User,{foreignKey:'user_id'});

//Order -> Refund (1-N)
Order.hasMany(Refund,{foreignKey:'order_id'});
Refund.belongsTo(Order,{foreignKey:'order_id'});

//User -> Refund (1-N)
User.hasMany(Refund,{foreignKey:'vendor_id'});
Refund.belongsTo(User,{foreignKey:'vendor_id'});

//Refund -> RefundItem (1-N)
Refund.hasMany(RefundItem,{foreignKey:'refund_id'});
RefundItem.belongsTo(Refund,{foreignKey:'refund_id'});

//Orderitem -> RefundItem (1-N)
Orderitem.hasMany(RefundItem,{foreignKey:'orderitem_id'});
RefundItem.belongsTo(Orderitem,{foreignKey:'orderitem_id'});



export {
    User,
    RefreshToken,
    Userlog,
    VendorProfile,
    Otp,
    Category,
    Product,
    Cart,
    Cartitem,
    Order,
    Orderitem,
    Review,
    Coupon,
    Couponitem,
    CouponUsage,
    StripeCustomer,
    UserCard,
    Refund,
    RefundItem
};
