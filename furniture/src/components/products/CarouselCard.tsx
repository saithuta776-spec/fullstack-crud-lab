"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/type";
import { Link } from "react-router";

interface productProp {
  items: Product[];
}

export function CarouselPlugin({ items }: productProp) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-1">
        {items.map((product) => (
          <CarouselItem key={product.id} className="pl-1 lg:basis-1/3">
            <div className="flex gap-4 p-4 lg:px-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="size-28 rounded-md"
              />
              <div className="">
                <h3 className="line-clamp-1 text-sm font-bold">
                  {product.name}
                </h3>
                <p className="my-2 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                  {/* {product.description.length > 55
                    ? product.description.substring(0, 55) + "..."
                    : product.description} */}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="text-own text-sm font-semibold hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
