import { createPrismaClient } from "@duckmetric/db";
import type { APIRoute } from "astro";

const prisma = createPrismaClient();

export const POST: APIRoute = async ({ request }) => {
	try {
		const { email } = await request.json();

		if (!email || typeof email !== "string") {
			return new Response(JSON.stringify({ error: "Email is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase().trim() },
			select: { id: true, emailVerified: true },
		});

		const account = user
			? await prisma.account.findFirst({
					where: {
						userId: user.id,
						providerId: "credential",
					},
					select: { id: true },
				})
			: null;

		return new Response(
			JSON.stringify({
				exists: !!user,
				hasPassword: !!account,
				emailVerified: user?.emailVerified ?? false,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch {
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
