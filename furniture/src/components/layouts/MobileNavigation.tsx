import { Link } from "react-router";
import type { MainNavItem } from "@/type/index";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";

interface MainNavigationProps {
  navl?: MainNavItem[];
}

export default function MobileNavigation({ navl }: MainNavigationProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const query = "(min-width: 1024px)";

  useEffect(() => {
    const result = matchMedia(query);
    setIsDesktop(result.matches);

    function onChange(ok: MediaQueryListEvent) {
      setIsDesktop(ok.matches);
    }
    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  if (isDesktop) {
    return null;
  }
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="ml-4 size-5">
            <Icons.menu aria-hidden="true" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pt-9 pr-0 pl-4">
          <SheetClose>
            <Link to="/" className="flex items-center">
              <Icons.logo className="mr-2 size-4" />
              <span className="font-bold">{siteConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
          </SheetClose>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>{navl?.[0].title}</AccordionTrigger>
                <AccordionContent className="flex flex-col items-start space-y-2 pl-3">
                  {navl?.[0].card?.map((item) => (
                    <SheetClose className="" key={item.title}>
                      <Link
                        to={String(item.href)}
                        className="text-foreground/70"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-col items-start space-y-2">
              {navl?.[0].menu?.map((item) => (
                <SheetClose className="" key={item.title}>
                  <Link to={String(item.href)} className="">
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
