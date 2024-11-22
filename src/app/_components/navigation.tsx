"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const Navigation = ({ className }: { className?: string }) => (
  <NavigationMenu className={className}>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="/search" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Search
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="/albums" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Albums
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="/track" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Track
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="/tracks" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Tracks
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href="/artists" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Artists
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export default Navigation;
