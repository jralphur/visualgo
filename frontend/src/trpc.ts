// import { QueryClient } from "@tanstack/react-query";
// import { createTRPCClient, httpBatchLink } from "@trpc/client";
// import {
//   createTRPCContext,
//   createTRPCOptionsProxy,
// } from "@trpc/tanstack-react-query";
// import type { AppRouter } from "../../backend/src/router";

// import assert from "node:assert";
// // export const { TRPCProvider, useTRPC, useTRPCClient } =
// //   createTRPCContext<AppRouter>();
// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {},
//   },
// });
// const trpcClient = createTRPCClient<AppRouter>({
//   links: [httpBatchLink({ url: "http://localhost:2022" })],
// });
// export const trpc = createTRPCOptionsProxy<AppRouter>({
//   client: trpcClient,
//   queryClient,
// });
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../backend/src/router";

// assert(
//   import.meta.env.VITE_BACKEND_PORT,
//   "PORT environment variable is not set!",
// );
const HOST = import.meta.env.VITE_BACKEND_HOST;
const PORT = import.meta.env.VITE_BACKEND_PORT;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    },
  },
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `http://${HOST}:${PORT}` })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
