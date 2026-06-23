import { auth } from "@duckmetric/auth";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const password = body?.password;

		if (typeof password !== "string" || password.length < 8) {
			return Response.json(
				{ error: "Password must be at least 8 characters" },
				{ status: 400 },
			);
		}

		await auth.api.setPassword({
			body: { newPassword: password },
			headers: request.headers,
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error("Failed to set password:", error);
		return Response.json({ error: "Failed to save password" }, { status: 400 });
	}
};
