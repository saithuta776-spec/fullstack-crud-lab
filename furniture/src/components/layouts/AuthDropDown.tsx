import { Icons } from "@/components/ui/icons";
import type { User } from "@/type";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";

interface DataProps {
  data: User;
}

export default function AuthDropDown({ data }: DataProps) {
  if (!data) {
    return (
      <Button size={`sm`}>
        <Link to={`/signIn`}>
          Sign in
          <span className="sr-only">Sign in</span>
        </Link>
      </Button>
    );
  }

  const initialName = `${data?.firstName.charAt(0) ?? ""} ${data?.lastName.charAt(0) ?? ""}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" className={`size-8 rounded-full`}>
          <Avatar className={`size-8`}>
            <AvatarImage src={data.imageUrl} alt={data.username ?? ""} />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className={`font-normal`}>
            <div className="flex flex-col space-x-1">
              <p className="text-sm leading-none font-medium">
                {data.firstName} {data.lastName}
              </p>
              <p className="text-muted-foreground text-sm leading-none">
                {data.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to={`#`} className="flex w-full items-center">
                <Icons.dahboard className="mr-2 size-4" aria-hidden="true" />
                <span className="flex-1">Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`#`} className="flex w-full items-center">
                <Icons.dahboard className="mr-2 size-4" aria-hidden="true" />
                <span className="flex-1">Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to={`logIn`} className="flex w-full items-center">
                <Icons.exist className="mr-2 size-4" aria-hidden="true" />
                <span className="flex-1">Log in</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuGroup>
    </DropdownMenu>
  );
}
