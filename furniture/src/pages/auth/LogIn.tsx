import { Link } from "react-router";
import { Icons } from "@/components/ui/icons";
import Banner from "@/data/images/house.webp";
import { LogInForm } from "@/components/auth/LoginForm";

export default function LogIn() {
  return (
    <div className="relative">
      <Link
        to={"/"}
        className="text-foreground/80 hover:text-foreground fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight transition-colors"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span className="">Furniture Shop</span>
      </Link>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full items-center justify-center px-6 lg:px-0">
          <LogInForm />
        </div>
        <div className="hidden lg:block">
          <img
            src={Banner}
            alt="Furniture"
            className="size-full object-cover"
          />
        </div>
      </main>
    </div>
  );
}
