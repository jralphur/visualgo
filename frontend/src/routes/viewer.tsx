import { createFileRoute } from "@tanstack/react-router";
import Viewer from "@/components/Viewer";

export const Route = createFileRoute("/viewer")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Viewer></Viewer>;
}
