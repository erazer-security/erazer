import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col gap-5 py-10 lg:px-44">
      <h1 className="text-center text-[50px] font-medium leading-[55px] tracking-[-2.5px]">
        The Erazer Team
      </h1>
      <h4 className="text-[#A7A7A7] text-center text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
        The people behind it all
      </h4>
      <div className="flex flex-col gap-10 mt-16">
        <div className="lg:flex flex-row items-center">
          <Image
            src="/about/nayeemur.svg"
            alt="Nayeemur"
            width={345}
            height={258}
          />
          <div className="-translate-y-7 lg:-translate-y-0 lg:-translate-x-7 flex flex-col gap-2 rounded-2xl bg-[#00000080] backdrop-blur-xl p-5">
            <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
              Nayeemur Rahman
            </h4>
            <p className="text-[#A7A7A7] text-base font-normal leading-[20.8px] tracking-[0.32px]">
              Education at MIT | Engineering Lead | Previously Software
              Engineering at Angi | Previously Cybersecurity at IAC | ML
              Research at MIT CSAIL
            </p>
          </div>
        </div>
        <div className="lg:flex flex-row items-center">
          <Image
            src="/about/gazi.svg"
            alt="Gazi"
            width={345}
            height={258}
            className="lg:order-1 lg:-translate-x-7 lg:z-[-1]"
          />
          <div className="-translate-y-7 lg:-translate-y-0 flex flex-col gap-2 rounded-2xl bg-[#00000080] backdrop-blur-xl p-5">
            <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
              Gazi Rahman
            </h4>
            <p className="text-[#A7A7A7] text-base font-normal leading-[20.8px] tracking-[0.32px]">
              Education at Wesleyan University | Al/ML Lead | Audiovisual ML at
              Wesleyan | Previously ML at Dotdash Meredith | Previously Product
              Development at Apollo Global Management
            </p>
          </div>
        </div>
        <div className="lg:flex flex-row items-center">
          <Image src="/about/sadaf.svg" alt="Sadaf" width={345} height={258} />
          <div className="-translate-y-7 lg:-translate-y-0 lg:-translate-x-7 flex flex-col gap-2 rounded-2xl bg-[#00000080] backdrop-blur-xl p-5">
            <h4 className="text-[26px] font-medium leading-[28.6px] tracking-[-1.3px]">
              Sadaf Khan
            </h4>
            <p className="text-[#A7A7A7] text-base font-normal leading-[20.8px] tracking-[0.32px]">
              Education at Harvard University | Operations Lead | Previously
              Product Development at Oar Health | Previously Governmental
              Relations at IAC | Developed online privacy policy strategies with
              US State Department and EU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
