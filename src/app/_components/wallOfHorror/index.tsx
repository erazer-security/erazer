import React from "react";
import Image from "next/image";
import { Story } from "@/app/types/Story";
import stories from "./stories.json";

export default function WallOfHorror() {
  return (
    <>
      {/* mobile and tablet */}
      <div className="flex flex-col lg:hidden gap-10">
        <h1 className="text-[50px] md:text-[56px] font-medium leading-[55px] tracking-[-2.5px] mt-36">
          Wall of Horror
        </h1>
        <h4 className="md:w-[431px] text-[26px] text-[#A7A7A7] font-medium leading-[28.6px] tracking-[-1.3px]">
          Hear stories from others who’ve had their identities stolen
        </h4>
        {stories.stories.map((story: Story, index: number) => (
          <div
            key={index}
            className="relative bg-[#ffffff0d] rounded-3xl px-10 py-10"
          >
            <Image
              src="/wallOfHorror/pin.svg"
              alt="Pin"
              width={32}
              height={35}
              className="absolute -translate-y-14 left-5"
            />
            <div className="flex flex-col gap-5">
              <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
                {story.title}
              </h4>
              <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px] ">
                {story.story}
              </p>
              <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px]">
                · {story.author}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* desktop */}
      <div className="hidden lg:flex flex-row mt-36 gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <h1 className="text-[56px] font-medium leading-[55px] tracking-[-2.5px]">
              Wall of Horror
            </h1>
            <h4 className="w-[431px] text-[26px] text-[#A7A7A7] font-medium leading-[28.6px] tracking-[-1.3px] mb-5">
              Hear stories from others who’ve had their identities stolen
            </h4>
          </div>
          {stories.stories.slice(0, 2).map((story: Story, index: number) => (
            <div
              key={index}
              className="relative bg-[#ffffff0d] rounded-3xl px-10 py-10"
            >
              <Image
                src="/wallOfHorror/pin.svg"
                alt="Pin"
                width={32}
                height={35}
                className="absolute -translate-y-14 left-5"
              />
              <div className="flex flex-col gap-5">
                <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
                  {story.title}
                </h4>
                <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px] ">
                  {story.story}
                </p>
                <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px]">
                  · {story.author}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          {stories.stories.slice(2).map((story: Story, index: number) => (
            <div
              key={index}
              className="relative bg-[#ffffff0d] rounded-3xl px-10 py-10"
            >
              <Image
                src="/wallOfHorror/pin.svg"
                alt="Pin"
                width={32}
                height={35}
                className="absolute -translate-y-14 left-5"
              />
              <div className="flex flex-col gap-5">
                <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
                  {story.title}
                </h4>
                <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px] ">
                  {story.story}
                </p>
                <p className="text-[16px] font-normal leading-[20.8px] tracking-[0.32px]">
                  · {story.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
