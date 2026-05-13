import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import FeaturedCommunityPosts from "@/components/FeaturedCommunityPosts";
import { FetchError } from "@/components/FetchError";
import { trpc } from "@/trpc";

export const Route = createFileRoute("/")({
  component: App,
  // loader: ({ context }) => {
  //   context.queryClient.ensureQueryData(
  //     trpc.graphs.getRecentGraphs.queryOptions({ limit: 10 }),
  //   );
  // },
  errorComponent: FetchError,
});

function App() {
  // const { data: recentPosts } = useSuspenseQuery(
  //   trpc.graphs.getRecentGraphs.queryOptions({ limit: 10 }),
  // );

  return (
    <div className="text-center">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <h1>Visualize Algorithms</h1>
        <h2>Easily graph and animate popular computer science algorithms.</h2>

        <h3>
          Draw visualizations of popular data structures with ease, then see
          them animated through popular programming languages!
        </h3>
      </header>
      <header>Share graphs and algorithms with the community.</header>
      {/* recentcommunity posts */}
      {/* <FeaturedCommunityPosts posts={recentPosts} /> */}
      <header>Start creating! Pick a template.</header>
      Array, strings, graphs, bitmask, hashtable
      <div>{/* Template picker */}</div>
    </div>
  );
}
