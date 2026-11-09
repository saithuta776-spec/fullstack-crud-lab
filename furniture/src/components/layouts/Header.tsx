import { MainNavigation } from "@/components/layouts/MainNavigation";
import { siteConfig } from "@/config/site";
import MobileNavigation from "./MobileNavigation";
import { ModeToggle } from "../mode-toggle";
import AuthDropDown from "./AuthDropDown";
import { User } from "@/data/user";
import CartSheet from "@/components/layouts/CartSheet";

export default function Header() {
  return (
    <header className="bg-background fixed top-0 z-50 w-full border-b">
      <nav className="container mx-auto flex h-16 items-center">
        <MainNavigation navl={siteConfig.mainNav} />
        <MobileNavigation navl={siteConfig.mainNav} />
        <div className="mr-8 flex flex-1 items-center justify-end gap-4 lg:mr-0">
          <CartSheet />
          <ModeToggle />
          <AuthDropDown data={User} />
        </div>
      </nav>
    </header>
  );
}
