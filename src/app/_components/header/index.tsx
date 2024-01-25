"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route, routes } from "./routes";
import useUser from "@/lib/useUser";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { data: user } = useUser();

  const HeaderRoutes: string[] = [
    "Process",
    "Testimonials",
    "Pricing",
    user ? (pathname === "/dashboard" ? "Sign Out" : "Dashboard") : "Sign In",
  ];

  return (
    <nav
      className={`flex flex-row justify-between lg:justify-around items-center mt-12 ${className}`}
    >
      <Link href="/">
        <Image
          src="/logoTextOnly.svg"
          alt="Erazer Logo"
          width={128}
          height={24}
        />
      </Link>
      <div className="hidden lg:flex flex-row px-8 py-4 justify-center items-center gap-6 rounded-[40px] border-[1px] border-solid border-[#31343D] bg-gradient-to-r from-black to-black backdrop-blur-xl">
        {routes.map(
          (route: Route, index: number) =>
            HeaderRoutes.includes(route.title) && (
              <Link
                key={index}
                href={route.path}
                className="text-base text-[#75778B]"
              >
                {route.title}
              </Link>
            )
        )}
      </div>
      <div className="flex flex-row items-center gap-5">
        <Link
          href="/#community"
          className="hidden lg:flex flex-row text-base px-8 py-4 justify-center items-center gap-6 rounded-[40px] backdrop-blur-xl bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
        >
          Join Waitlist
        </Link>
        {user && (
          <Image
            src={user.picture}
            alt="Profile Picture"
            width={36}
            height={36}
            className="h-fit hidden lg:flex rounded-full"
          />
        )}
      </div>
      <div className="lg:hidden">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger />
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {routes.map(
                    (route: Route, index: number) =>
                      HeaderRoutes.includes(route.title) && (
                        <Link
                          key={index}
                          href={route.path}
                          className="text-base text-white block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {route.title}
                        </Link>
                      )
                  )}
                  <Link
                    href="/#community"
                    className="flex flex-row text-base px-8 py-4 justify-center items-center gap-6 rounded-[40px] backdrop-blur-xl bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
                  >
                    Join Waitlist
                  </Link>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
