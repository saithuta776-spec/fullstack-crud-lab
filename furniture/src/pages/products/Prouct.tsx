import { products, filterList } from "@/data/product";
import ProductCard from "@/components/products/ProductCard";
import PaginationDemo from "@/components/products/Pagination";
import ProductFilter from "@/components/products/ProductFilter";

export default function Prouct() {
  return (
    <div className="container mx-auto">
      <section className="flex flex-col md:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          {/* {/* <ProductFilter title="Furnitures Made By" filterList = {filterList.categories} /> */}
          <ProductFilter List={filterList} />
        </section>
        <section className="my-8 w-full lg:ml-0 lg:w-4/5">
          <h1 className="mb-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
          <PaginationDemo />
        </section>
      </section>
    </div>
  );
}
