import React from "react";
import type { Cart } from "@/type";
import { formatPrice } from "@/lib/utils";
import { cartItems } from "@/data/cart";
import { Separator } from "../ui/separator";
import Card from "./Editable";

interface itemProps {
  item: Cart;
}
export default function CartItmes({ item }: itemProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex gap-4 space-y-2">
        <img
          src={item.image.url}
          alt="item-pic"
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{item.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(item.price)} x {item.quantity} ={" "}
            {formatPrice((item.price * item.quantity).toFixed(2))}{" "}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
            {`${item.category}/ ${item.subcategory}`}
          </span>
        </div>
      </div>
      <div className="">
        <Card />
      </div>
      <Separator className="" />
    </div>
  );
}
