import { Icons } from "@/components/ui/icons";
import { Icon } from "lucide-react";

interface RatingProps {
  rating: number;
}

export default function Rating({ rating }: RatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icons.star
          key={i}
          className={`size-4 ${rating >= i + 1 ? "text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}
