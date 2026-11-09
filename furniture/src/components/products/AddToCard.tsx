import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 1. Zod schema requiring at least 1 item
const quantitySchema = z.object({
  quantity: z
    .number({ error: "Quantity must be a number" })
    .min(1, { message: "Minimum quantity is 1" }),
});

type QuantityFormValues = z.infer<typeof quantitySchema>;

interface ShowBuyNowProps {
  canBuy?: boolean;
}

export default function AddToCard({ canBuy }: ShowBuyNowProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuantityFormValues>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // Watch current quantity for +/- button operations
  const currentQuantity = watch("quantity") || 1;

  const handleIncrement = () => {
    setValue("quantity", currentQuantity + 1, { shouldValidate: true });
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      setValue("quantity", currentQuantity - 1, { shouldValidate: true });
    }
  };

  const onSubmit = (data: QuantityFormValues) => {
    console.log("Adding quantity to cart:", data);
    toast.success(`Added ${data.quantity} item(s) to cart successfully.`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Quantity Control Row: (-) [ Input ] (+) */}
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={currentQuantity <= 1}
          className="size-9 shrink-0 rounded-r-none border-r-0"
        >
          <Icons.minus className="size-3" aria-hidden="true" />
          <span className="sr-only">Decrease quantity</span>
        </Button>

        <Input
          type="number"
          inputMode="numeric"
          min={1}
          {...register("quantity", { valueAsNumber: true })}
          className={cn(
            "h-9 w-16 [appearance:textfield] rounded-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            errors.quantity &&
              "border-destructive focus-visible:ring-destructive",
          )}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          className="size-9 shrink-0 rounded-l-none border-l-0"
        >
          <Icons.plus className="size-3" aria-hidden="true" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>

      {/* Validation Error Message */}
      {errors.quantity && (
        <p className="text-destructive text-xs font-medium">
          {errors.quantity.message}
        </p>
      )}

      {/* 2. Action Buttons Stack */}
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          className={cn(
            "bg-own font-bold",
            !canBuy && "pointer-events-none bg-slate-400",
          )}
        >
          Buy Now
        </Button>

        <Button
          type="submit"
          size="sm"
          variant={canBuy ? "outline" : "default"}
          className="font-semibold"
        >
          Add to Cart
        </Button>
      </div>
    </form>
  );
}
