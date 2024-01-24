import React from "react";
import Image from "next/image";

export default function Pricing() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-[50px] md:text-[56px] text-center font-medium leading-[55px] tracking-[-2.5px] mt-24 mb-28">
        Pricing for Your Peace of Mind
      </h2>

      <div className="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 w-[353px] h-[959px] md:w-[614px] lg:w-[763px] md:h-[504px] bg-[#ffffff0d] rounded-2xl backdrop-blur-xl px-5 md:px-10">
        <div className="relative">
          <div className="absolute top-10 md:top-16 left-[50px] lg:left-[30px]">
            <h2 className="text-[56px] font-medium leading-10 tracking-tighter">
              Free
            </h2>
            <h3 className="text-[32px] font-medium leading-10 tracking-tighter my-5">
              Basic
            </h3>
            <div className="flex flex-row gap-2 items-start">
              <Image
                src="/pricing/purpleCheckCircle.svg"
                alt="Check Mark"
                width={20}
                height={20}
              />
              <p className="w-44 text-[#a7a7a7a7] text-base font-normal leading-5 tracking-wider">
                Free security report on your digital footprint with 70+ data
                borkers
              </p>
            </div>
          </div>
          <button className="absolute w-fit left-[50px] lg:left-[30px] bottom-16 rounded-3xl bg-[#7e30e1] px-10 py-3 mt-16 md:mt-[155px] hover:bg-[#3F0687] active:bg-[#100320]">
            Get Started
          </button>
        </div>

        <div className="relative rounded-t-2xl backdrop-blur-xl -mt-10 bg-gradient-to-br from-[#7e30e140] to-[#49108b40]">
          <div className="absolute inline-block top-10 left-[50px] lg:left-[70px] bg-white text-[10px] text-[#49108B] font-extrabold rounded-full px-4 py-2 mb-7">
            MOST POPULAR
          </div>
          <div className="absolute top-[104px] left-[50px] lg:left-[70px]">
            <h2 className="text-[56px] font-medium leading-10 tracking-tighter">
              $9.99
              <span className="text-[22px] font-normal tracking-[0.44px]">
                /month
              </span>
            </h2>
            <h3 className="text-[32px] font-medium leading-10 tracking-tighter my-5">
              Standard
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2 items-start">
                <Image
                  src="/pricing/whiteCheckCircle.svg"
                  alt="Check Mark"
                  width={20}
                  height={20}
                />
                <p className="w-44 text-base font-normal leading-5 tracking-wider">
                  Automated removal from 70+ data broker websites
                </p>
              </div>
              <div className="flex flex-row gap-2 items-start">
                <Image
                  src="/pricing/whiteCheckCircle.svg"
                  alt="Check Mark"
                  width={20}
                  height={20}
                />
                <p className="w-44 text-base font-normal leading-5 tracking-wider">
                  One time removal cost
                </p>
              </div>
            </div>
          </div>
          <button className="absolute w-fit left-[50px] lg:left-[70px] bottom-16 rounded-3xl bg-white text-[#49108B] px-10 py-3 mt-16 hover:bg-gray-200 active:bg-gray-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
