import { Request,Response,NextFunction } from "express";
import adminService from "../services/adminService";
import { successResponse } from "../utils/response";

export const adminDash = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const dash = await adminService.adminDash();
        const TotalCustomer = dash.totalUser-dash.totalVendor-1;
        const TotalOrders = {
            pending:dash.totalPendingOrder,
            deliver:dash.totalDeliverOrder,
            total:dash.totalDeliverOrder+dash.totalPendingOrder
        }
        //store only orderIds in array
        let PendingOrderIds:number[]=[];
        for(const item of dash.orderPending){
            PendingOrderIds.push(item.order_id)
        }
        successResponse(
            res,
            "Dashboard",
            200,
            {
                TotalUser:dash.totalUser,
                TotalVendor:dash.totalVendor,
                TotalCustomer,
                TotalProduct:dash.totalProduct,
                TotalOrders,
                VendorRevenue:dash.vendorRevenue,
                UserPurchase:dash.userPurchase,
                PendingOrderIds
            }
        )
    } catch (err) {
        next(err)
    }
}

export const getTopSellProducts = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const products = await adminService.getTopSellProducts();
        const totalRecords = products.length;
        successResponse(res,"Top Sell Products",200,{totalRecords,products});
    } catch (err) {
        next(err);
    }
}

export const getTopRatedProducts = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const products = await adminService.getTopRatedProducts();
        successResponse(res,"Top Rated Products",200,products);
    } catch (err) {
        next(err);
    }
}

// export const oldUserInStripe = async(
//     req:Request,
//     res:Response,
//     next:NextFunction
// ) => {
//     try {
//         const added = await adminService.oldUserInStripe();
//         successResponse(res,"create as Stripe Customer",201);
//     } catch (err) {
//         next(err);
//     }
// }