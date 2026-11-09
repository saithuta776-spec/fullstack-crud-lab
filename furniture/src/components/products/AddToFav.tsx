import React, { useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

interface FavouriteProp {
  productId: string;
  rating: number;
  isFavourite?: boolean;
  // onClick?: (favState: boolean) => void;
}

export default function AddToFav({
  rating,
  isFavourite = false,
  // onClick,
}: FavouriteProp) {
  // Local state to track toggle
  const [isFav, setIsFav] = useState(isFavourite);

  const handleToggle = () => {
    setIsFav(!isFav);
  };

  const label = isFav ? "Remove from favourites" : "Add to favourites";

  return (
    <Button
      variant="secondary"
      size="icon"
      className="mb-2 size-8 shrink-0"
      aria-label={label}
      title={`${label} — rating ${rating}`}
      onClick={handleToggle}
    >
      <Icons.heart
        className={`size-4 ${isFav ? "fill-red-500 text-red-500" : ""}`}
      />
    </Button>
  );
}
