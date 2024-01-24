import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Route, routes } from "@/app/_components/header/routes";

interface SideNavProps {
  className?: string;
}

const SideNavRoutes: string[] = ["Dashboard", "Wall of Horror", "Feedback"];
const SideNavIcons: { [key: string]: string } = {
  Dashboard: "dashboardIcon.svg",
  "Wall of Horror": "wallOfHorrorIcon.svg",
  Feedback: "feedbackIcon.svg",
};

export default function SideNav({ className }: SideNavProps) {
  return (
    <div
      className={`w-fit flex flex-col gap-8 bg-[#2E3033] px-6 pt-12 pb-7 rounded-2xl ${className}`}
    >
      <Link href="/" className="flex justify-center">
        <Image
          src="/logoTextOnly.svg"
          alt="Erazer Logo"
          width={128}
          height={24}
        />
      </Link>
      {routes.map(
        (route: Route, index: number) =>
          SideNavRoutes.includes(route.title) && (
            <Link
              key={index}
              href={route.path}
              className={`text-base flex flex-row gap-2 justify-start rounded-full ${
                route.title === "Dashboard"
                  ? "bg-white text-black px-7 py-3"
                  : "text-[#B0B0B0] ml-5"
              }`}
            >
              <Image
                src={`/sideNav/${SideNavIcons[route.title]}`}
                alt="Icon"
                width={20}
                height={20}
              />
              {route.title}
            </Link>
          )
      )}
      <Link href="http://localhost:5001/logout" className="mt-auto">
        Log Out
      </Link>
    </div>
  );
}
