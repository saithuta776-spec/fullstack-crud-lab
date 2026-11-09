import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cartItems } from "@/data/cart";
import { Icons } from "../ui/icons";
import { ScrollArea } from "../ui/scroll-area";
import CartItems from "@/components/carts/CartItmes";
import { formatPrice } from "@/lib/utils";

export default function CartSheet() {
  const itemCount = 4;
  const amountTotal = 190;

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="outline"
          size={`icon`}
          className={`relative`}
          aria-label="open-cart"
        >
          <Badge
            variant={`destructive`}
            className="absolute -top-2 -right-2 size-6 justify-center rounded-full p-2.5"
          >
            {itemCount}
          </Badge>
          <Icons.cart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className={`w-full px-4 md:max-w-lg`}>
        <SheetHeader className="">
          <SheetTitle className={`flex justify-center`}>Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className={`my-4 h-[70vh] pb-8`}>
              <div className="flex-1">
                {cartItems.map((cart) => (
                  <CartItems key={cart.id} item={cart} />
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4">
              <Separator className={`px-4`} />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between px-4">
                  <span className="">Shipping</span>
                  <span className="">Free</span>
                </div>
                <div className="flex justify-between px-4">
                  <span className="">Taxes</span>
                  <span className="">Calculated at checkout</span>
                </div>
                <div className="flex justify-between px-4">
                  <span className="">Total</span>
                  <span className="">
                    {formatPrice(amountTotal.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose>
                <Button type="submit" className={`w-full`}>
                  Continue to Checkout
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <Icons.cart className="text-muted-foreground size-16" />
            <div className="text-muted-foreground text-xl font-medium">
              Your Card is empty.
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
