import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { Testimonial } from "@/app/types/Testimonial";
import testimonials from "./testimonials.json";

export default function TestimonialsCarousel() {
  return (
    <div className="overflow-x-hidden">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent>
          {testimonials.testimonials.map(
            (testimonial: Testimonial, index: number) => (
              <CarouselItem key={index} className="basis-[525px] h-[360px]">
                <div className="bg-[#ffffff0d] h-full flex flex-col gap-4 rounded-3xl p-12">
                  <Image
                    src={
                      testimonial.stars === 4
                        ? "/testimonials/4stars.svg"
                        : "/testimonials/5stars.svg"
                    }
                    alt="Rating"
                    width={128}
                    height={22}
                  />
                  <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
                    &ldquo;{testimonial.title}&rdquo;
                  </h4>
                  <p className="text-[#a7a7a7] text-[16px] font-normal leading-[20.8px] tracking-[0.32px]">
                    {testimonial.description}
                  </p>
                  <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px]">
                    · {testimonial.author}
                  </p>
                </div>
              </CarouselItem>
            )
          )}
        </CarouselContent>
        <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2">
          <Image src="/home/next.svg" alt="next slide" width={56} height={56} />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
