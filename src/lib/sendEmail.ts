import {Resend} from 'resend'
import { ReactNode } from "react";

interface SendEmailProps {
    to:string,
    subject: string,
    component: ReactNode
}
export async function sendEmail({to, subject, component}: SendEmailProps){
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    try {
        const { data } = await resend.emails.send({
            from: 'Welth <welth@chakam.com.ng>',
            to,
            subject,
            react: component,
         });

         return {success:true, data}
    } catch (error) {
        console.error('Failed to send email', error);
        return {_success:false, error}
    }

}