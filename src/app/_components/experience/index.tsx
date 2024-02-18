"use client";
import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const logos = [
  "mit",
  "ddm",
  "weslyan",
  "mitech",
  "iac",
  "angi",
  "csail",
  "apollo",
  "harvard",
  "oar",
];

export default function Experience() {
  return (
    <div className="flex flex-col gap-12 items-center justify-center mt-32 lg:mt-36">
      <h2 className="text-center text-[50px] md:text-[56px] font-medium leading-[55px] tracking-[-2.5px]">
        Our Experiences Come From
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 1500,
            }),
          ]}
        >
          <CarouselContent>
            {logos.map((logo: string) => (
              <CarouselItem
                className="basis-1/3 md:basis-1/4 lg:basis-1/6 flex items-center justify-center"
                key={logo}
              >
                <Image
                  src={`/experience/${logo}.svg`}
                  alt={logo}
                  width={125}
                  height={28}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 left-0 w-[50%] bg-gradient-to-r from-black to-transparent via-transparent"></div>
        <div className="absolute inset-0 left-auto right-0 w-[50%] bg-gradient-to-l from-black to-transparent via-transparent"></div>
      </div>
    </div>
  );
}
