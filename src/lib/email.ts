import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface MailContent {
	subject: string;
	html: string;
	text: string;
}

interface Mail {
	to: string[];
	content: MailContent;
}

const createTransporter = () => {
	return createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
};

const sendMail = async (mail: Mail): Promise<SMTPTransport.SentMessageInfo> => {
	const transporter = createTransporter();

	return transporter.sendMail({
		from: 'BDE 42 Angoulême',
		to: mail.to,
		subject: mail.content.subject,
		text: mail.content.text,
		html: mail.content.html,
	});
};

export { createTransporter, sendMail };
export type { Mail, MailContent };
