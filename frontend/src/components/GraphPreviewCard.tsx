import { Link } from "@tanstack/react-router";

interface GraphPreviewCard {
  graph: {
    username: string;
    name: string;
    uid: string;
    preview: string;
    description: string;
    last_modified: string;
  };
  className?: string;
}

export const GraphPreviewCard = ({ graph, className }: GraphPreviewCard) => {
  const { username, name, uid, preview, description, last_modified } = graph;

  return (
    <div className={className}>
      <img src={preview} alt={`${name} preview`} />
      <Link to={`/post/$postid`} params={{ postid: uid }}>
        {name}
      </Link>
      <h2>by {username}</h2>
      <p>{description}</p>

      <section>Last modified: {last_modified} </section>
    </div>
  );
};
