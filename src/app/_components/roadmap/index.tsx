import React from "react";
import Image from "next/image";

export default function Roadmap() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="lg:text-center text-[50px] md:text-[56px] font-medium leading-[55px] tracking-[-2.5px] mt-56">
        Explore Erazer’s Roadmap
      </h2>
      <h4 className="text-[#a7a7a7] lg:text-center text-[26px] font-medium leading-10 tracking-tighter mt-7 mb-12 lg:mb-20">
        Follow us as we expand our services, continuously ensuring your digital
        safety
      </h4>
      <Image
        loading="lazy"
        src="/roadmap/timeline.svg"
        alt=""
        width={1075}
        height={245}
      />
    </div>
  );
}
