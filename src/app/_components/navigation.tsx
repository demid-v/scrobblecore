"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

const listItems = [
  { href: "search", name: "Search" },
  { href: "albums", name: "Albums" },
  { href: "tracks", name: "Tracks" },
  { href: "artists", name: "Artists" },
  { href: "track", name: "Track" },
];

const Navigation = () => {
  const pathname = usePathname().split("/");
  const firstPathname = pathname.at(1);

  const isActive = (match: string) =>
    match === firstPathname && pathname.length === 2;

  return (
    <>
      <NavigationMenu className="hidden xl:block">
        <NavigationMenuList>
          {listItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={isActive(item.href)}
                asChild
              >
                <Link href={`/${item.href}`}>{item.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="hidden md:block xl:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                {listItems.map((item) => (
                  <li key={item.href}>
                    <Link href={`/${item.href}`} className="">
                      {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */}
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "w-full justify-start",
                        )}
                        active={isActive(item.href)}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default Navigation;
