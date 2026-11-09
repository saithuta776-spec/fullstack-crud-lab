import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Couch from "@/data/images/couch (1).png";
import { CarouselPlugin } from "@/components/products/CarouselCard";
import { products } from "@/data/product";
import { posts } from "@/data/post";
import BlogCard from "@/components/blogs/BlogCard";
import ProductCard from "@/components/products/ProductCard";

const sampleSlice = posts.slice(0, 3);
const sampleProduct = products.slice(0, 4);

export default function Home() {
  const Title = ({
    title,
    href,
    sideText,
  }: {
    title: string;
    href: string;
    sideText: string;
  }) => (
    <div className="mt-28 mb-10 flex flex-col px-4 md:flex-row md:justify-between md:px-0">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <Link className="text-muted-foreground font-semibold underline" to={href}>
        {sideText}
      </Link>
    </div>
  );

  const postsData = posts.map((post) => ({
    ...post,
    updatedAt: post.updated_at,
  }));

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="my-8 text-center lg:mt-20 lg:mb-0 lg:w-2/5 lg:text-left">
          <h1 className="text-own mb-4 text-4xl font-extrabold lg:mb-8 lg:text-6xl">
            Modern Interior Design Studio
          </h1>
          <p className="mb-6 lg:mb-8">
            Furniture is an essential component of any living space, providing
            functionality, comfort, and aesthetic appeal.
          </p>
          <div className="flex justify-center">
            <Button className="mr-2 rounded-full bg-orange-300 px-8 py-6 font-bold">
              <Link to="#">Shop Now</Link>
            </Button>
            <Button
              className="rounded-full px-8 py-6 font-bold"
              variant={`outline`}
            >
              <Link to="#">Explore</Link>
            </Button>
          </div>
        </div>
        <img src={Couch} alt="Couch" className="lg:w-3/5" />
      </div>
      <CarouselPlugin items={products} />
      <Title
        title="Featured Products"
        href="/products"
        sideText="View All Products"
      />
      <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-4">
        {sampleProduct.map((product) => (
          <ProductCard item={product} key={product.id} />
        ))}
      </div>

      <Title title="Recent Blog" href="/blogs" sideText="View All Posts" />
      <BlogCard posts={sampleSlice} />
    </div>
  );
}
