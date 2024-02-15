import React from "react";
import TestimonialsCarousel from "@/app/_components/testimonialsCarousel";

export default function Testimonials() {
  return (
    <div className="mt-32 lg:mt-60">
      <h2 className="text-[50px] md:text-[56px] font-medium leading-10 tracking-tighter">
        Testimonials
      </h2>
      <h4 className="text-[#a7a7a7] text-[26px] font-medium leading-10 tracking-tighter mt-7 mb-20">
        See what users are saying about Erazer
      </h4>
      <TestimonialsCarousel />
    </div>
  );
}
