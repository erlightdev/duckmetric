import type { AppRouterClient } from "@duckmetric/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

export const link = new RPCLink({
  url: `${window.location.origin}/rpc`,
});

export const orpc: AppRouterClient = createORPCClient(link);
