import { Category, Orderitem, Product, Review, User, VendorProfile } from "../models";
import ApiError from "../utils/apiError";
import path from 'path';
import fs from 'fs';
import fsPromise from 'fs/promises';
import { Op, Sequelize } from "sequelize";
import { deletefromS3, getImageUrl } from "../utils/s3Helper";

type createProductBody = {
    productId:number;
    name:string,
    category:number,
    price:number,
    quantity:number,
}
export const createProduct = async(body:createProductBody,userId:number,filekey:string|undefined) => {
    const {productId,name,category,price,quantity} = body;
    
    //update logic
    if(productId > 0){
        //check exist or not
        const updateProduct = await Product.findOne({
            where:{product_id:productId,user_id:userId}});
        if(!updateProduct)throw new ApiError("Product not exist",400);

        //filepath of uploaded file before
        // const filekey = path.join(__dirname,`../uploads/products/${updateProduct.filename}`);

        //update the all values
        name ? updateProduct.name = name : updateProduct.name = updateProduct.name;
        category ? updateProduct.category_id = category : updateProduct.category_id = updateProduct.category_id;
        price ? updateProduct.price = price : updateProduct.price = updateProduct.price;
        quantity ? updateProduct.quantity += quantity : updateProduct.quantity = updateProduct.quantity;
        updateProduct.is_available = true;

        //delete and update the image from uploads folder
        if(filekey){
            if(updateProduct.filename){
                await deletefromS3(updateProduct.filename);
            }
            updateProduct.filename = filekey;
        }
        //save in DB
        await updateProduct.save();

        const data = {
            id:updateProduct.product_id,
            name:updateProduct.name,
            category:updateProduct.category_id,
            user:updateProduct.user_id,
            price:updateProduct.price,
            quantity:updateProduct.quantity,
            imageUrl:updateProduct.filename
        }

        return {data,msg:"Product Updated Successfully",code:200};
    }else{

        //vendor profile check 
        const vendor = await VendorProfile.findOne({where:{user_id:userId}});
        if(!vendor) throw new ApiError("Profile Missing",400);
        if(vendor.status !== 'Verified') throw new ApiError("Not Verified Yet",400); 

        //if file not exist 
        if(filekey === undefined) throw new ApiError("image is required",400);
        if(!name && !category && !price && !quantity){
            throw new ApiError("Fields missing",400);
        }

        //check exist or not
        const existProduct = await Product.findOne({where:{name,user_id:userId}});
        if(existProduct)throw new ApiError("Product exist",400);

        //if not exist then create new product
        const product = await Product.create({
            name,
            category_id:category,
            user_id:userId,
            price,
            quantity,
            is_available:true,
            filename:filekey
        });

        const data = {
            id:product.product_id,
            name:product.name,
            category:product.category_id,
            price:product.price,
            quantity:product.quantity,
            image:product.filename
        }
        return {data,msg:"Product created successfully",code:201};
    }
}
export const getProducts = async(vendorId:number) => {
    //get all the data
    const products = await Product.findAll({
        where:{user_id:vendorId},
        attributes:[
            'product_id','name',
            [Sequelize.col('Category.name'),'category'],
            'user_id','price','quantity','filename',
            [Sequelize.literal(`price*quantity  `),'Total'] //count the total amount of each product; 
        ],
        include:[
            {model:Category,attributes:[]},
        ]
    });

    //update the url so that can be clickable
    // products.map((p)=>{
    //     p.filename = `${baseUrl}`+`${p.filename}`;
    // });
    const result = await Promise.all(
        products.map(async(p)=>{
            const signedUrl = p.filename
                ? await getImageUrl(p.filename)
                :null;
            return {
                ...p.toJSON(),
                imageUrl:signedUrl,
                filename:undefined,
            }
        })
    );

    return result;
}
export const deleteProduct = async(productId:number,userId:number) => {
    
    //check product exist or not
    const product = await Product.findOne({where:{product_id:productId}});
    if(!product) throw new ApiError("Product is not exist",400);

    //check logged is owner of this project or not
    if(product.user_id !== userId) throw new ApiError("Permission denied",403);

    // const filepath = path.join(__dirname,`../uploads/products/${product.filename}`)
    // Delete image from S3 first, then delete DB record
    if(product.filename){
        await deletefromS3(product.filename);
    }

    // try {
    //     await fsPromise.unlink(filepath);
    // } catch (err) {
    //     throw new ApiError("Failed to delete file", 500);
    // }

    //if exist then delete
    await product.destroy();
    
}

type getUserProductBody = {
    search?:string,
    category?:number,
    min_price?:number,
    max_price?:number,
    sort?:string,
    page?:number,
    limit?:number
}
export const getUserProducts = async(body:getUserProductBody) => {
    //destructure body
    const {search,category,min_price,max_price,sort,page=1,limit=5} = body;

    //where and order clause for filtering
    const whereCondition:any = {};
    let orderCondition:any = [];

    //assign the value to both clause
    if(search)whereCondition.name = {[Op.like]:`%${search}%`};
    if(category)whereCondition.category_id = category;
    if(min_price)whereCondition.price = {[Op.gte]:min_price};
    if(max_price)whereCondition.price = {[Op.lte]:max_price};
    if(min_price && max_price)whereCondition.price = {[Op.between]: [min_price, max_price]};
    if(sort)orderCondition = [[`${sort}`,'ASC']];
    else{
        orderCondition = [['createdAt','DESC']];
    }

    //for pagination
    let offset = Number((page-1)*limit);

    //review image path 


    const {count,rows} = await Product.findAndCountAll({
        limit,
        offset,
        //without this, a product with 2 reviews was counted as 2 products unique product_id counts
        distinct:true,
        where:whereCondition,
        attributes:[
            'product_id',
            'name',
            [Sequelize.col('Category.name'),'category'],
            'price',
            'quantity',
            [Sequelize.col('User.name'),'owner'],
            [Sequelize.col('User.VendorProfile.shop_name'),'shopName'],
            [Sequelize.col('User.VendorProfile.city'),'city'],
            [Sequelize.col('User.VendorProfile.state'),'state'],
        ],
        include:[
            {model:Category,attributes:[]},
            {
                model:User,
                attributes:[],
                include:[
                    {model:VendorProfile,attributes:[]}
                ]
            },
            {
                model:Review,
                as:'Reviews',
                attributes:[
                    'rating',
                    'comment',
                    'image_url',
                ],
                include:[
                    {model:User,attributes:['user_id','name']}
                ],
                //it will correct pagination before limit apply on review after using this limit apply on product table
                separate:true
            }
        ],
        order:orderCondition
    });
    return {count,rows,page,limit};
}

export default {createProduct,getProducts,deleteProduct,getUserProducts};