import { Order, Orderitem, Product, User } from "../models"
import ApiError from "../utils/apiError";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendReceiptEmail } from "../utils/sendEmail";

export const createReceipt = async(orderID:number) => {
    
    // Fetch order details
    const order = await Order.findOne({
        where:{order_id:orderID}
    });
    if(!order) throw new ApiError("Order not found",404);

    // Fetch order items
    const orderItem = await Orderitem.findAll(
        {where:{order_id:orderID},
        include:[
            {model:Product,attributes:["name"]}
        ]
    });
    if(!orderItem) throw new ApiError("Order Item not found",404);


    const doc = new PDFDocument({ margin: 50 });

    // Generate unique filename for the receipt
    const filename = `${Date.now()}-${orderID}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'receipts', filename);

    // Ensure the receipts directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ================= HEADER =================
    doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('blue')
        .text('Multivendor', { align: 'center' });
    doc.moveDown();

    doc
        .fontSize(12)
        .fillColor('black')
        .text(`Receipt for Order #${order.order_id}`, { align: 'center' });
    doc.moveDown();

    doc
        .fontSize(10)
        .text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown(2);

    // ================= TABLE =================
    // Header
    doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('Item        Qty        Price        Total',{ align: 'center'});
    doc.moveDown(0.5);

    // Divider
    doc.font('Helvetica').text('---------------------------------------------',{ align: 'center' });
    doc.moveDown(0.5);

    // Rows
    let totalAmount:number = 0;
    orderItem.forEach((item: any) => {
        const total = item.quantity * item.unit_price;

        doc.text(
            `${item.Product.name}    ${item.quantity}    ${item.unit_price}    ${total}`,
            { align: 'center' }
        );
        totalAmount +=total;
    });

    doc.moveDown();

    // Bottom Divider
    doc.text('---------------------------------------------',{ align: 'center' });
    doc.moveDown();

    // ================= TOTAL =================
    if(order.coupon_id){
        const discount = totalAmount - order.total_amount;
        doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('red')
        .text(`Total Discount: ${discount}`, { align: 'center' });
        doc.moveDown(0.5);
    }     
    doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('green')
    .text(`Total Amount: ${order.total_amount}`, { align: 'center' });

    doc.end();

    // it will ensure that pdf generation is completed before moving forward
    await new Promise((resolve,reject)=>{
        stream.on('finish',resolve);
        stream.on('error',reject);
    });

    const userEmail = await User.findOne({
        where:{user_id:order.user_id},
        attributes:["email"]
    });
    if(!userEmail) throw new ApiError("User not found",404);

    await sendReceiptEmail(userEmail.email,filePath);
}