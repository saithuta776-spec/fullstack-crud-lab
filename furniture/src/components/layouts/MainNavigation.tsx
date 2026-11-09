import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import type { MainNavItem } from "@/type/index";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

interface MainNavigationProps {
  navl?: MainNavItem[];
}

export function MainNavigation({ navl }: MainNavigationProps) {
  return (
    <div className="hidden gap-1.5 lg:flex">
      <Link to="/" className="flex items-center space-x-2">
        <Icons.logo className="size-7" aria-hidden="true" />
        <span className="font-bold">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          {navl?.[0]?.card ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>{navl[0].title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink>
                      <Link
                        className="from-muted/50 to-muted flex size-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                        to="/"
                      >
                        <Icons.logo className="size-6" aria-hidden="true" />
                        <div className="mb-2 text-lg font-medium sm:mt-4">
                          {siteConfig.name}
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {siteConfig.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {navl[0].card.map((item) => (
                    <ListItem
                      key={item.title}
                      href={String(item.href)}
                      title={item.title}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : null}
          {navl?.[0]?.menu &&
            navl[0].menu.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link to={String(item.href)}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
