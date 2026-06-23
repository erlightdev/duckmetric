import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),

		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		FACEBOOK_CLIENT_ID: z.string().min(1),
		FACEBOOK_CLIENT_SECRET: z.string().min(1),

		SMTP_HOST: z.string().min(1),
		SMTP_PORT: z.coerce.number().default(465),
		SMTP_SECURE: z.coerce.boolean().default(true),
		SMTP_USER: z.string().min(1),
		SMTP_PASS: z.string().default(""),
		EMAIL_FROM: z.string().min(1),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
