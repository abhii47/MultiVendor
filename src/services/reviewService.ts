import { Order, Orderitem, Review } from "../models";
import ApiError from "../utils/apiError";
import { deletefromS3 } from "../utils/s3Helper";

type reviewBody = {
    product_id:number,
    rating:number,
    comment:string,
}
export const postReview = async(userId:number,body:reviewBody,files?:Express.MulterS3.File[]) => {
    const {product_id,rating,comment} = body;

    const image_url = files && files.length > 0 
                        ?files.map(file=>file.key)
                        :undefined;

    //check user purchased that product or not
    const orderitem = await Orderitem.findOne({
        where:{product_id},
        include:[
            {
                model:Order,
                attributes:[],
                where:{user_id:userId,status:'Delivered'},
            }
        ]
    })
    if(!orderitem) throw new ApiError("You can't post review on this product",400); 

    //create the review 
    const review = await Review.create({
        product_id,
        user_id:userId,
        rating,
        comment,
        is_verified_purchase:true,
        image_url
    });
    return review;
}

export const deleteReview = async(userId:number,reviewId:number) => {
    const review = await Review.findOne({
        where:{user_id:userId,review_id:reviewId},
        attributes:['review_id','product_id','rating','comment','image_url']
    });
    if(!review) throw new ApiError("Review Not found",404);

    const images:string[] = review.image_url || [];
    if(images.length > 0){
        try {
            await Promise.all(
                images.map(async(img:string)=>{
                    return await deletefromS3(img);
                })
            );
        } catch (error) {
            throw new ApiError("Failed to delete images from S3",500);
        }
    }

    await review.destroy();
    return review;
}

export default {postReview,deleteReview}