import { Link } from "react-router";
import { Icons } from "@/components/ui/icons";
import type { Product } from "@/type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { products } from "@/data/product";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice, cn } from "@/lib/utils";

// interface ProductProps {
//   item: Product;
// }

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Product;
}

export default function ProductCard({
  item,
  className,
  ...props
}: ProductProps) {
  return (
    <Card
      className={cn(`h-full w-full overflow-hidden rounded-2xl`, className)}
      {...props}
    >
      <Link to={`/products/${item.id}`} aria-label={item.name}>
        <CardHeader className="p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={item.images[0]}
              alt="product image"
              className="size-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1 text-xl font-bold">
            {item.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(item.price)}
            {item.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(item.discount)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>

      <CardFooter className="border-muted p-4">
        {item.status === "sold" ? (
          <Button
            size={`sm`}
            disabled={true}
            aria-label="true"
            className="h-8 w-full rounded-sm font-bold"
          >
            Sold out
          </Button>
        ) : (
          <Button
            size={`sm`}
            aria-label=""
            className="bg-own h-8 w-full font-bold"
          >
            <Icons.plus className="" />
            Add to card
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
