import nodemailer from 'nodemailer';
import ApiError from './apiError';
import { getEnv, loadEnv } from '../config/env';
import logger from './logger';
import path from 'path';

loadEnv();

const senderEmail = getEnv("SENDER_EMAIL");
const senderPass = getEnv("EMAIL_PASS");
if (!senderEmail || !senderPass) throw new ApiError("Environment var missing", 400);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderEmail,
        pass: senderPass,
    },
});

export const sendOtpEmail = async(to:string,otp:number) =>{
    try {
        await transporter.sendMail({
            to,
            from: senderEmail,
            subject:'Forget Password Otp Sended',
            html:`<div style="background-color:black;padding:2px 4px;border-radius:4px">
                    <center>
                        <h1 style="font-size:24px;color:green">Forget Password Otp</h1>
                    </center>
                  </div>
                  <p style="font-size:16px">your otp is <b>${otp}</b>.It is valid for 5 minutes</p>`
        });
        logger.info("✅ Email sent:",{to});
    } catch (err: unknown) {
        const errorMessage = err instanceof ApiError ? err.message : "Unknown email provider error";
        logger.error("❌ Nodemailer Error:", errorMessage);
    }
}

export const sendWelcomeEmail = async(to:string,name:string) => {
    try {
        await transporter.sendMail({
            to,
            from: senderEmail,
            subject:'Welcome to Our Platform!',
            html:`<div style="background-color:black;padding:2px 4px;border-radius:4px">
                    <center>
                        <h1 style="font-size:24px;color:green">REGISTRATION</h1>
                    </center>
                  </div>
                  <p style="font-size:16px"><b><span style="color:red">${name}</span>WELCOME YOUR REGISTRATION SUCCESS</b></p>`
        });
        logger.info("✅ Welcome email sent:",{to});
    } catch (err:any) {
        const errorMessage = err instanceof ApiError ? err.message : "Unknown email provider error";
        logger.error("❌ Nodemailer Error:", errorMessage);
    }
}

export const sendReceiptEmail = async(to:string,filepath:string) => {
    try {
        await transporter.sendMail({
            to,
            from: senderEmail,
            subject:'Your Order Receipt',
            text:'Thank you for your order! Please find your receipt attached.',
            attachments:[
                {
                    filename:path.basename(filepath),
                    path:filepath,
                }
            ]
        })
    } catch (err:any) {
        const errorMessage = err instanceof ApiError ? err.message : "Unknown email provider error";
        logger.error("❌ Nodemailer Error:", errorMessage);
    }
}