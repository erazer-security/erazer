"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/browser";
import useUser from "@/lib/useUser";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Route, routes } from "./routes";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const pathname = usePathname();
  const [transparent, setTransparent] = useState<boolean>(false);

  const handleSignIn = async () => {
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/dashboard"
            : "https://erazer.io/dashboard",
      },
    });
    if (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    queryClient.clear();
    await supabase.auth.signOut();
    router.refresh();
  };

  // Check if page user scrolled 75px (roughly the height of header) to update the background color of the header
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

  const HeaderRoutes: string[] = ["The Process", "About Us", "Pricing"];
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
        {user ? (
          pathname === "/dashboard" ? (
            <button
              onClick={handleSignOut}
              className="text-base text-[#75778B]"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/dashboard" className="text-base text-[#75778B]">
              Dashboard
            </Link>
          )
        ) : (
          <button onClick={handleSignIn} className="text-base text-[#75778B]">
            Sign In
          </button>
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
                        <NavigationMenuLink
                          key={index}
                          href={route.path}
                          className="text-base text-white block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#23242A] hover:text-accent-foreground focus:bg-[#23242A] focus:text-accent-foreground"
                        >
                          {route.title}
                        </NavigationMenuLink>
                      )
                  )}
                  {user ? (
                    pathname === "/dashboard" ? (
                      <button
                        onClick={handleSignOut}
                        className="text-left text-base text-white block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#23242A] hover:text-accent-foreground focus:bg-[#23242A] focus:text-accent-foreground"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="text-left text-base text-white block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#23242A] hover:text-accent-foreground focus:bg-[#23242A] focus:text-accent-foreground"
                      >
                        Dashboard
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="text-left text-base text-white block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#23242A] hover:text-accent-foreground focus:bg-[#23242A] focus:text-accent-foreground"
                    >
                      Sign In
                    </button>
                  )}
                  <NavigationMenuLink
                    href="/#community"
                    className="flex flex-row text-base px-8 py-4 justify-center items-center gap-6 rounded-[40px] backdrop-blur-xl bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
                  >
                    Join Waitlist
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
