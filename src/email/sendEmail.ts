import { random_code } from '@/database/numerous_code/random_code';
import * as nodemailer from 'nodemailer';

export async function sendEmail(adress: string) {
    const transporter = nodemailer.createTransport({
        	host: 'smtp.gmail.com',
        	port: 587,
        	secure: false,
        	auth: {
        		user: process.env.SMTP_USER,
        		pass: process.env.SMTP_PASS,
        	},
        });

        const code = await random_code();

        const info = await transporter.sendMail({
            from: '"bde" <manuarii.degache@gmail.com>',
            to: adress,
            subject: 'Code',
            text: code,
        });
}