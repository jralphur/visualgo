import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  type QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { queryClient } from "@/trpc";

import Header from "../components/Header";

interface Context {
  queryClient: QueryClient;
}

const Root = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  );
};

export const Route = createRootRouteWithContext<Context>()({
  component: Root,
});

