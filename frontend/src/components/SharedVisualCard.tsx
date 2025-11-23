import { Link } from "@tanstack/react-router";

interface SharedVisualCardProps {
  username: string | undefined;
  postid: string;
  description: string;
}

export default function SharedVisualCard({
  username,
  postid,
  description,
}: SharedVisualCardProps) {
  return (
    <Link to={`/post/$postid`} params={{ postid }}>
      {/* img */}
      <div>
        {username && (
          <Link to={`/user/$username`} params={{ username }}>
            @{username}
          </Link>
        )}
        <p>{description}</p>
      </div>
    </Link>
  );
}
