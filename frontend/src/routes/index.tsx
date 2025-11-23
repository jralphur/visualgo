import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
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
      <header>Start creating! Pick a template.</header>
      Array, strings, graphs, bitmask, hashtable
      <div>{/* Template picker */}</div>
      <header>Share graphs and algorithms with the community.</header>
      {/* community posts */}
    </div>
  );
}
