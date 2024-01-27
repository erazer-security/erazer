"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route, routes } from "./routes";
import useUser from "@/lib/useUser";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { data: user } = useUser();
  const [transparent, setTransparent] = useState<boolean>(false);

  // Check if page is at top to update the background color
  useEffect(() => {
    if (typeof window != "undefined") {
      const changeColor = () => {
        if (window.scrollY >= 75) {
          setTransparent(true);
        } else {
          setTransparent(false);
        }
      };
      window.addEventListener("scroll", changeColor);
    }
  });

  const HeaderRoutes: string[] = [
    "Process",
    "Testimonials",
    "Pricing",
    user ? (pathname === "/dashboard" ? "Sign Out" : "Dashboard") : "Sign In",
  ];
  return (
    <nav
      className={`sticky z-[1] h-[75px] md:h-[100px] lg:h-[115px] w-full top-0 left-0 ${
        transparent
          ? `backdrop-blur-xl bg-[#00000080] transition-all duration-100 ease-in`
          : ``
      } flex flex-row justify-around items-center ${className}`}
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
                <ul className="grid w-[350px] gap-3 p-4">
                  {routes.map(
                    (route: Route, index: number) =>
                      HeaderRoutes.includes(route.title) && (
                        <NavigationMenuLink key={index}>
                          <Link
                            href={route.path}
                            className="text-base text-white block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#23242A] hover:text-accent-foreground focus:bg-[#23242A] focus:text-accent-foreground"
                          >
                            {route.title}
                          </Link>
                        </NavigationMenuLink>
                      )
                  )}
                  <NavigationMenuLink>
                    <Link
                      href="/#community"
                      className="flex flex-row text-base px-8 py-4 justify-center items-center gap-6 rounded-[40px] backdrop-blur-xl bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
                    >
                      Join Waitlist
                    </Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
