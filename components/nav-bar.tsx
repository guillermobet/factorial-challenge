"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface Route {
  href: string;
  name: string;
}

const routes: Route[] = [
  {
    href: "overview",
    name: "Overview",
  },
  {
    href: "transactions",
    name: "Transactions",
  },
];

export async function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {routes.map((route: Route) => (
          <NavigationMenuItem key={route.href}>
            <Link href={`/${route.href}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {route.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
