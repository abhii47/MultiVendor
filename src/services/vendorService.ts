import { Sequelize,Op } from "sequelize";
import { VendorProfile,User, Product, Orderitem, Order, Category } from "../models";
import ApiError from "../utils/apiError";

type ProfileBody = {
    shopname:string,
    city:string,
    state:string,
}
export const createProfile = async(userId:number,body:ProfileBody) =>{
    const {shopname,city,state} = body;

    //check profile exist or not
    const existProfile = await VendorProfile.findOne({where:{user_id:userId}});
    if(existProfile) throw new ApiError("Already Exist Profile",400);

    //store profile data in DB
    const profile = await VendorProfile.create({
        user_id:userId,
        shop_name:shopname,
        city,
        state,
        status:"Not Verified"
    });

    //some userData send as response 
    const userData = await User.findOne({
        where:{user_id:userId},
        attributes:['name','email','role']
    })

    const profileData = {
        name:userData!.name,
        email:userData!.email,
        role:userData!.role,
        shopname:profile.shop_name,
        city:profile.city,
        state:profile.state,
        status:profile.status
    }
    return profileData;
}

export const getProfile = async(userId:number) =>{
    //find user profile
    const profile = await VendorProfile.findOne({where:{user_id:userId}});
    if(!profile) throw new ApiError("your profile not created yet",400);

    //some userData send as response 
    const userData = await User.findOne({
        where:{user_id:userId},
        attributes:['name','email','role']
    })

    const profileData = {
        name:userData!.name,
        email:userData!.email,
        role:userData!.role,
        shopName:profile.shop_name,
        city:profile.city,
        state:profile.state,
        status:profile.status
    }

    return profileData;
}

type updateProfileBody ={
    shopname?:string,
    city?:string,
    state?:string
}
export const updateProfile = async(userId:number,body:updateProfileBody)=>{
    const {shopname,city,state} = body;

    //create instance of current user
    const user = await VendorProfile.findOne({where:{user_id:userId}});
    if(!user) throw new ApiError("User Not LoggedIn",401);
    
    //update given values
    if(shopname !== undefined) user.shop_name = shopname;
    if(city !== undefined) user.city = city;
    if(state !== undefined) user.state = state;

    //save in DB
    await user.save();

    const updatedData = {
        id:user.user_id,
        shopname:user.shop_name,
        city:user.city,
        state:user.state
    }
    return updatedData;
}

export const verifyVendor = async(userId:number) => {

    //verify vendor or view unverified vendors
    if(userId === 0 || userId === undefined){
        //view all unverify vendors with their details
        const vendors = await VendorProfile.findAll({
            where:{status:'Not verified'},
            attributes:['user_id',
                [Sequelize.col('User.name'),'name'],
                [Sequelize.col('User.email'),'email'],
                [Sequelize.col('User.role'),'role'],
                'status','shop_name'
            ],
            include:[
                {
                    model:User,
                    attributes:[],
                }
            ]
        });
        return {vendors,msg:"Unverified Vendors"};
    }else{
        //get unverified vendor of given params
        const vendor = await VendorProfile.findOne({where:{user_id:userId,status:'Not Verified'}});
        if(!vendor) throw new ApiError('Unverified User not exist',400);
        //update that vendor
        await VendorProfile.update(
            {status:'Verified'},
            {where:{user_id:userId}}
        );
        const vendors = await VendorProfile.findOne({
            where:{user_id:userId},
            attributes:['user_id',
                [Sequelize.col('User.name'),'name'],
                [Sequelize.col('User.email'),'email'],
                [Sequelize.col('User.role'),'role'],
                'status','shop_name'
            ],
            include:[
                {
                    model:User,
                    attributes:[],
                }
            ]
        });
        return {vendors,msg:"Verify Vendor Successfully"};
    }
    
}

export const vendorDashboard = async(userId:number) =>{
    
    // total Products
    const totalProduct = await Product.count({where:{user_id:userId,is_available:true}});

    // total orders + revenue
    const {count,rows} = await Orderitem.findAndCountAll({
        attributes:[
            [Sequelize.fn('SUM',Sequelize.literal('Orderitem.quantity * Product.price')),'amount'],
        ],
        include:[
            {
                model:Product,
                attributes:[],
                where:{user_id:userId},
            },
            {
                model:Order,
                attributes:[],
                where:{status:'Delivered'}
            }
        ],
        raw:true
    });

    //Most selling Product
    const product = await Orderitem.findAll({
        attributes:[
            'product_id',
            [Sequelize.col('Product.name'),'product'],
            [Sequelize.fn('SUM',Sequelize.col('Orderitem.quantity')),'totalQuantity'],
            [Sequelize.fn('SUM',Sequelize.literal('Orderitem.quantity * Product.price')),'totalvalue'],
        ],
        include:[
            {
                model:Product,
                attributes:[],
                where:{user_id:userId}
            },{
                model:Order,
                attributes:[],
               where:{status:'Delivered'}
            }
        ],
        group:['product_id','product'],
        order:[['totalQuantity','DESC']]
    });

    //save dynamic field value local variable declare inside model
    let value:number;
    if(rows.length === 0)value = 0
    else value = Number(rows[0].amount)

    const totalOrder = count;  
    const topSellProduct = product;  
    const totalRevenue = value //it's work
    return {totalProduct,totalOrder,totalRevenue,topSellProduct};

}

export default {createProfile,getProfile,updateProfile,verifyVendor,vendorDashboard};