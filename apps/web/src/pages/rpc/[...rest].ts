import { createContext } from "@duckmetric/api/context";
import { appRouter } from "@duckmetric/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { APIRoute } from "astro";

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const context = await createContext({ headers: request.headers });

  const rpcResult = await handler.handle(request, {
    prefix: "/rpc",
    context,
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(request, {
    prefix: "/rpc/api-reference",
    context,
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
};
