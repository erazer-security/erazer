import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Route, routes } from "@/app/_components/header/routes";

const FooterRoutes: string[] = [
  "Process",
  "Testimonials",
  "Roadmap",
  "Pricing",
  "Privacy Policy",
];

export default function Footer() {
  return (
    <div className="bg-[#ffffff0d] flex flex-col">
      <div className="flex flex-col lg:flex-row lg:justify-around gap-12 lg:gap-0 border-t-[1px] border-[#31343D] ml-5 lg:ml-0 pt-28 pb-20">
        <div className="w-[250px] flex flex-col gap-5">
          <Image
            src="/footer/fullLogo.svg"
            alt="logo"
            width={214}
            height={47}
          />
          <p className="text-[#5F5F61] text-lg font-normal leading-[30px]">
            Because getting your data sold isn&apos;t cute
          </p>
          <div className="flex flex-row items-center gap-2">
            <Link
              href="https://www.facebook.com/groups/321264396948984/"
              target="_blank"
            >
              <Image
                src="/footer/facebook.svg"
                alt="Facebook logo"
                width={11}
                height={19}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/company/erazerinc/"
              target="_blank"
            >
              <Image
                src="/footer/linkedIn.svg"
                alt="Linkedin logo"
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xl font-extrabold leading-[22px] mb-10">Product</p>
          <div className="flex flex-col gap-5">
            {routes.map(
              (route: Route, index: number) =>
                FooterRoutes.includes(route.title) && (
                  <Link
                    key={index}
                    href={route.path}
                    className="text-[#5F5F61] text-lg font-normal leading-[20px]"
                  >
                    {route.title}
                  </Link>
                )
            )}
          </div>
        </div>
        <div>
          <p className="text-xl font-extrabold leading-[22px] mb-10">
            Contact Us
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-2">
              <Image
                src="/footer/email.svg"
                alt="email logo"
                width={17}
                height={13}
              />
              <Link
                href={"/contact-us"}
                className="text-[#5F5F61] text-lg font-normal leading-[20px]"
              >
                support@erazer.io
              </Link>
            </div>
            <div className="flex flex-row gap-2">
              <Image
                src="/footer/location.svg"
                alt="email logo"
                width={14}
                height={17}
              />
              <p className="text-[#5F5F61] text-lg font-normal leading-[20px]">
                New York City
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between lg:justify-around gap-1 md:gap-0 border-t-[1px] border-[#31343D] mx-5 lg:mx  -0 py-5">
        <p className="text-[#5F5F61] text-lg font-normal leading-[30px]">
          Copyright © 2024 Erazer Corp.
        </p>
        <p className="text-[#5F5F61] text-lg font-normal leading-[30px] flex flex-row gap-1">
          Made with{" "}
          <Image
            src="/footer/heart.svg"
            alt="erazer heart"
            width={20}
            height={20}
          />{" "}
          in NYC
        </p>
        <p className="text-[#5F5F61] text-lg font-normal leading-[30px]">
          All Rights Reserved
        </p>
      </div>
    </div>
  );
}
