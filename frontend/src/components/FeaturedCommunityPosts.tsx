import type { PostPreview } from "@/types";
import { Carousel } from "./carousel/Carousel";
import { GraphPreviewCard } from "./GraphPreviewCard";

interface FeaturedCommunityPostsProps {
  posts: PostPreview[];
}

const FeaturedCommunityPosts = ({ posts }: FeaturedCommunityPostsProps) => {
  return (
    <Carousel
      content={posts}
      render={(post: PostPreview) => <GraphPreviewCard graph={post} />}
      options={{
        loop: false,
        breakpoints: {
          "2xl": {
            items_per_page: 5,
          },
        },
        orientation: "horizontal",
        controls: "block",
      }}
    />
  );
};

export default FeaturedCommunityPosts;
