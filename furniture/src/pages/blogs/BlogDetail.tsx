import { useParams, Link } from "react-router";
import { posts } from "@/data/post";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Icon } from "lucide-react";
import RichText from "@/components/blogs/RichText";

export default function BlogDetail() {
  const { postId } = useParams();
  const post = posts.find((post) => post.id === postId);
  return (
    <div className="container mx-auto px-4 lg:px-0">
      <section className="flex flex-col justify-between lg:flex-row">
        <section className="w-full lg:w-3/4 lg:pr-16">
          <Button variant="outline" className="mt-8 mb-6">
            <Link
              to="/blogs"
              className="flex h-full w-full items-center gap-2 px-4 py-2"
            >
              <Icons.arrowLeft />
              <span className="">All Posts</span>
            </Link>
          </Button>
          {/* <Button variant="outline" className="mt-8 mb-6 p-0">
            <Link
              to="/blogs"
              className="flex h-full w-full items-center gap-2 px-4 py-2"
            >
              <Icons.arrowLeft />
              <span>All Posts</span>
            </Link>
          </Button> */}
          {post ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">{post.title}</h2>
              <div className="mt-2 text-sm">
                <span className="">
                  {" "}
                  by
                  <span className="font-[600]"> {post.author}</span> on
                  <span className="font-[600]"> {post.updated_at}</span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">{post.content}</h3>
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-xl"
              />
              <RichText body={post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {post.tags.map((tag) => (
                  <Button variant={`secondary`}>{tag}</Button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mt-8 mb-16 text-center text-xl font-bold lg:mt-24">
              No Post Found
            </p>
          )}
        </section>
        <section className="w-full lg:mt-24 lg:w-1/4">
          <div className="mb-8 flex items-center gap-2 text-base font-semibold">
            <Icons.layer />
            <h3>Other Blogs Posts</h3>
          </div>

          <div className="gird-cols-1 grid md:grid-cols-2 lg:grid-cols-1">
            {posts.map((post) => (
              <Link
                to={`/blogs/${post.id}`}
                className="mb-6 flex items-start gap-2"
              >
                <img
                  src={post.image}
                  alt="blog post"
                  className="w-1/4 rounded"
                />
                <div className="text-muted-foreground w-3/4 text-sm font-[500]">
                  <p className="line-clamp-2">{post.content}</p>
                  <i className="">...see more</i>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
