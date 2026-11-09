import type { Post } from "@/type";
import { Link } from "react-router";

interface PostProps {
  items: Post[];
}

export default function BlogPostList({ items }: PostProps) {
  return (
    <div className="gird-cols-1 my-8 grid gap-8 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
      {items.map((post) => (
        <Link to={`/blogs/${post.id}`} className="" key={post.id}>
          <img
            src={post.image}
            alt="Blog Post"
            className="mb-4 w-full rounded-xl"
          />
          <h2 className="line-clamp-1 text-xl font-extrabold">{post.title}</h2>
          <h3 className="my-2 line-clamp-3 text-base font-[400]">
            {post.content}
          </h3>
          <div className="text-sm">
            <span className="">
              {" "}
              by
              <span className="font-[600]"> {post.author}</span> on
              <span className="font-[600]"> {post.updated_at}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
