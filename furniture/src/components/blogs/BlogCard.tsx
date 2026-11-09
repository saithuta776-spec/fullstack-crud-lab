import type { Post } from "@/type";
import { Link } from "react-router";

interface PostProsp {
  posts: Post[];
}

export default function BlogCard({ posts }: PostProsp) {
  return (
    <div className="gird-cols-1 my-8 grid gap-8 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
      {posts.map((post) => (
        <Link to={`/blogs/${post.id}`} className="" key={post.id}>
          <img
            src={post.image}
            alt="Blog Post"
            className="mb-4 w-full rounded-2xl"
          />
          <h3 className="ml-4 line-clamp-1 font-semibold">{post.title}</h3>
          <div className="mt-2 ml-4 text-sm font-semibold">
            <span className="">
              {" "}
              by
              <span className="font-[600]"> {post.author}</span>on
              <span className="font-[600]"> {post.updated_at}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
