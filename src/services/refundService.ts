import { Refund, RefundItem } from "../models";

enum RefundType {
    FULL = 'Full',
    PARTIAL = 'Partial'
}
enum RefundStatus {
    SUCCESS = 'Processed',
    FAIL = 'Failed'
}

export const createRefund = async(
    refundId:string,
    orderId:number,
    amount:number,
    reasonType:string,
    refundType:RefundType,
    status:RefundStatus,
    vendorId?:number
) => {
    const refund = await Refund.create({
        stripe_refund_id:refundId,
        order_id:orderId,
        vendor_id:vendorId || undefined,
        amount,
        reason_type:reasonType,
        refund_type:refundType,
        status,
    });
    return refund;
}

export const createRefunditem = async(
    refundId:number,
    orderitemId:number,
    amount:number
) => {
    const refunditems = RefundItem.create({
        refund_id:refundId,
        orderitem_id:orderitemId,
        amount
    });
    return refunditems
}