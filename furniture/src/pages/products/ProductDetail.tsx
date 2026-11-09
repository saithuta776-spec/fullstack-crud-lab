import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { products } from "@/data/product";
import { Icon } from "lucide-react";
import { Link, useParams } from "react-router";

import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Rating from "@/components/products/Rating";
import AddToFav from "@/components/products/AddToFav";
import AddToCard from "@/components/products/AddToCard";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((product) => product.id === productId);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="container mx-auto px-4 md:px-0">
      <section className="mb-8">
        <Button variant={`outline`} className={`mt-8`}>
          <Link
            to={`/products`}
            className="flex h-full w-full items-center gap-2 px-4 py-2"
          >
            <Icons.arrowLeft />
            <span>All Products</span>
          </Link>
        </Button>
      </section>

      <section className="flex flex-col gap-8 md:flex-row md:gap-16">
        <Carousel plugins={[plugin.current]} className="w-full md:w-1/2">
          <CarouselContent>
            {product?.images.map((image) => (
              <CarouselItem key={image}>
                <div className="p-1">
                  <img
                    src={image}
                    alt={product.name}
                    className="size-full rounded-md object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator className={`mt-4 md:hidden`} />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="">
            <h2 className="mb-2 line-clamp-1 text-2xl font-bold">
              {product?.name}
            </h2>
            <p>{formatPrice(Number(product?.price))}</p>
          </div>

          <Separator className="my-1.5" />
          <p className="text-muted-foreground text-base">
            {product?.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={Number(product?.rating)} />
            <AddToFav
              productId={String(product?.id)}
              rating={Number(product?.rating)}
              isFavourite={Boolean(product?.isFavourite)}
            />
          </div>
          <AddToCard canBuy={product?.status === "active"} />
          <Separator className="my-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {product?.description ?? "No description is available."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="my-8 space-y-6 overflow-hidden">
        <h2 className="line-clamp-1 text-2xl font-bold">
          More Products From Furniture Shop
        </h2>
        <ScrollArea className="w-full pb-4 whitespace-nowrap">
          <div className="flex gap-8">
            {products.slice(0, 4).map((selected_item) => (
              <ProductCard
                key={selected_item.id}
                item={selected_item}
                className="w-[260px] shrink-0 sm:w-[300px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
