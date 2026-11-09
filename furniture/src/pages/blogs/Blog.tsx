import { posts } from "@/data/post";
import BlogPostList from "@/components/blogs/BlogPostList";

// const normalizedPosts = posts.map((post) => ({
//   ...post,
//   id: Number(post.id),
// }));

export default function Blog() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-center text-2xl font-bold md:text-left">
        Latest Blog Post
      </h1>
      <BlogPostList items={posts} />
    </div>
  );
}
