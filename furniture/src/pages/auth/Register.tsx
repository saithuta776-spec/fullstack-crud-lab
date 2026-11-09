import { RegisterForm } from "@/components/auth/RegisterForm";
import { Icons } from "@/components/ui/icons";
import { Link } from "react-router";

export default function Register() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <Link
        to={"/"}
        className="text-foreground/80 hover:text-foreground fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight transition-colors"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span className="">Furniture Shop</span>
      </Link>
      <RegisterForm />
    </div>
  );
}
