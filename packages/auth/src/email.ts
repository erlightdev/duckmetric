import { env } from "@duckmetric/env/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
});

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	try {
		const info = await transporter.sendMail({
			from: env.EMAIL_FROM,
			to,
			subject,
			html,
		});
		console.log("📧 Email sent:", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		throw error;
	}
}
