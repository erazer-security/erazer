import React from "react";
import Image from "next/image";

export default function WhyErazer() {
  return (
    <div className="flex flex-col gap-10 mt-[500px]">
      <div className="flex flex-col gap-4">
        <p className="text-center text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
          Locks prevent theft of your physical spaces...
        </p>
        <h2 className="text-center text-[50px] md:text-[56px] font-medium leading-[61.6px] tracking-[-2.8px]">
          Erazer prevents theft of your digital spaces
        </h2>
      </div>
      <div className="relative flex justify-center pb-[56.25%] -mx-5 md:-mx-16 lg:-mx-44">
        {/* the wrapper div has a relative position and a padding-bottom of 56.25%, which maintains a 16:9 aspect ratio. The image and video are positioned absolutely within the wrapper, so they will fill the space of the wrapper without affecting the layout of other elements on the page. */}
        <Image
          src="/whyErazer/circuit.svg"
          alt="circuit"
          width={100}
          height={100}
          className="absolute w-full h-auto"
        />
        <video controls className="absolute w-[90%] lg:w-[70%] rounded-3xl">
          <source src="/whyErazer/whyErazer.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
