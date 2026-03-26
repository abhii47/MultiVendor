import { Category, Product } from "../models";
import ApiError from "../utils/apiError";

export const createCategory = async(name:string) =>{

    //check category exist or not
    const exist = await Category.findOne({where:{name}});
    if(exist) throw new ApiError("This category already exists",400);

    //save category in DB
    const category = await Category.create({name});

    const data = {
        id:category.category_id,
        name:category.name
    }
    return data;
}

export const getCategories = async() =>{
    const allCategory = await Category.findAll({
        attributes:['category_id','name'],
        order:[['createdAt','ASC']]
    });
    return allCategory;
}

export const deleteCategory = async(id:number) => {
    
    //check category exist or not
    const category = await Category.findByPk(id);
    if(!category) throw new ApiError("Category not exist",400);

    //check category linked with products or not
    const linkCategory = await Product.findOne({where:{category_id:category.category_id}});
    if(linkCategory) throw new ApiError("Category can't be delete",403); 

    //delete the category
    await category.destroy();

}


export default {createCategory,getCategories,deleteCategory};