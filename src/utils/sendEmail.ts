import nodemailer from 'nodemailer';
import ApiError from './apiError';
import { getEnv, loadEnv } from '../config/env';

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
        console.log("✅ Email sent:", to);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown email provider error";
        console.error("❌ Nodemailer Error:", errorMessage);
    }
}
