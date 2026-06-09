import { random_code } from '@/database/numerous_code/random_code';
import { prisma } from '@/database/prisma/prisma';
import * as nodemailer from 'nodemailer';

export async function sendEmailCode(adress: string) {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	const code = await random_code();

	await transporter.sendMail({
		from: 'bde',
		to: adress,
		subject: 'Code',
		text: code,
	});

	await prisma.users.update({
		where: { mail: adress },
		data: { code: code },
	});
}
