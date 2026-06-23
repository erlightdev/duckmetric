import { createPrismaClient } from "@duckmetric/db";
import { env } from "@duckmetric/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./email";

export function createAuth() {
	const prisma = createPrismaClient();

	return betterAuth({
		appName: "Duckmetric",
		database: prismaAdapter(prisma, {
			provider: "postgresql",
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			minPasswordLength: 8,
			maxPasswordLength: 128,
			revokeSessionsOnPasswordReset: true,
		},
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
			facebook: {
				clientId: env.FACEBOOK_CLIENT_ID,
				clientSecret: env.FACEBOOK_CLIENT_SECRET,
			},
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }, _request) => {
				await sendEmail({
					to: user.email,
					subject: "Verify your email address",
					html: `<p>Hi ${user.name},</p><p>Click the link below to verify your email:</p><p><a href="${url}">Verify Email</a></p><p>This link expires in 24 hours.</p>`,
				});
			},
		},
		plugins: [
			emailOTP({
				disableSignUp: true,
				async sendVerificationOTP({ email, otp, type }) {
					const subject =
						type === "sign-in"
							? "Your sign-in code"
							: type === "email-verification"
								? "Your verification code"
								: "Your password reset code";

					const label =
						type === "sign-in"
							? "sign in"
							: type === "email-verification"
								? "verify your email"
								: "reset your password";

					await sendEmail({
						to: email,
						subject,
						html: `<p>Your OTP code to ${label} is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p><p>This code expires in 5 minutes. Do not share it with anyone.</p>`,
					});
				},
				otpLength: 6,
				expiresIn: 300,
				allowedAttempts: 5,
				storeOTP: "hashed",
				storeOTP: "hashed",
			}),
		],
		advanced: {
			useSecureCookies: env.NODE_ENV === "production",
		},
	});
}

export const auth = createAuth();
