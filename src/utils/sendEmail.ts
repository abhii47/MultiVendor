import sgMail from '@sendgrid/mail';
import ApiError from './apiError';
import { getEnv, loadEnv } from '../config/env';

loadEnv();

const Email = getEnv("SENDER_EMAIL");
const Api = getEnv("EMAIL_API");
if(!Api || !Email) throw new ApiError("Environment var missing",400);

sgMail.setApiKey(Api);

export const sendOtpEmail = async(to:string,otp:number) =>{
    try {
        await sgMail.send({
            to,
            from:Email,
            subject:'Forget Password Otp Sended',
            html:`<div style="background-color:black;padding:2px 4px;border-radius:4px">
                    <center>
                        <h1 style="font-size:24px;color:green">Forget Password Otp</h1>
                    </center>
                  </div>
                  <p style="font-size:16px">your otp is <b>${otp}</b>.It is valid for 5 minutes</p>`
        });
    } catch (err) {
        throw new ApiError("Something Went Wrong",400);
    }
}
