import { stripe } from "../config/stripe"
import Stripe from "stripe";

export const createCustomer = async(name:string,email:string) => {
    try {
        const customer = await stripe.customers.create({name,email})
        return customer;
    } catch (err:any) {
        throw new Error(err.message);
    }
};

export const saveCardToCustomer = async(customerId:string,tokenId:string) => {
    try {
        const card = await stripe.customers.createSource(customerId,{
            source:tokenId
        });
        // return card as Stripe.Card;
        if (card.object !== 'card') throw new Error('Expected a card source');
        return card as unknown as Stripe.Card;
    } catch (err:any) {
        throw new Error(err.message);
    }
}

export const createCharge = async(amount:number,cardId:string,customerId:string) => {
    try {
        const charge = await stripe.charges.create({
            amount: amount*100,
            currency: 'inr',
            source: cardId,        //card_xxxxx
            customer:customerId,
        });
    return charge;
    } catch (err:any) {
        throw new Error(err.message)
    }
}

export const refundCharge = async(chargeId:string) => {
        const refund = await stripe.refunds.create({
            charge:chargeId
        });
        return refund;
}

export const partialRefundCharge = async(chargeId:string,amount:number) => {
    const refund = await stripe.refunds.create({
        charge:chargeId,
        amount:amount*100
    });
    return refund;
}


// this is for paymentIntent Which directly succeded if we create this
// export const createPyementIntent = async(amount:number,customerId:string) => {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount:amount*100,
//         currency:'inr',
//         customer:customerId
//     });

//     return paymentIntent;
// }

