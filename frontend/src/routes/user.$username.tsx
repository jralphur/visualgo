import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$username")({
  component: UserProfile,
  loader: (_) => ({
    username: "Mister Todo",
    date_created: new Date(Date.now()),
    posts: [{}],
  }),
});

function UserProfile() {
  const { username, date_created } = Route.useLoaderData();

  return (
    <div>
      {/* <img /> Image here */}
      <div>
        <span>@{username}</span>
        <span>Since {date_created.toString()}</span>
      </div>
      <h1>Submitted Posts</h1>
    </div>
  );
}
