import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/post/$postid")({
  component: SharedPost,
});

function SharedPost() {
  return <div></div>;
}
