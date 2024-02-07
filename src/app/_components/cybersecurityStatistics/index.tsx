import React from "react";

export default function CybersecurityStatistics() {
  return (
    <div>
      <h2 className="text-[50px] md:text-[56px] text-center font-medium leading-[55px] tracking-tighter mt-[500px] mb-7">
        Cybersecurity by the numbers
      </h2>
      <h4 className="text-[#a7a7a7] text-[26px] text-center font-medium leading-10 tracking-tighter mb-14 lg:mb-24">
        Building a Strong and Engaged Community
      </h4>
      <div className="flex flex-col lg:flex-row gap-[47px] lg:gap-0 justify-evenly items-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-[56px] font-medium leading-10 tracking-tighter">
            5,000<span className="text-[#7e30e1]">+</span>
          </p>
          <p className="text-[26px] font-medium leading-10 tracking-tighter mt-5 mb-2">
            Searches
          </p>
          <p className="text-base text-center text-[#a7a7a7] font-normal">
            Cultivating a robust and dynamic <br /> follower community
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-[56px] font-medium leading-10 tracking-tighter">
            15,000<span className="text-[#7e30e1]">+</span>
          </p>
          <p className="text-[26px] font-medium leading-10 tracking-tighter mt-5 mb-2">
            Profiles Removed
          </p>
          <p className="text-base text-center text-[#a7a7a7] font-normal leading-10 tracking-tighter">
            From data brokers
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-[56px] font-medium leading-10 tracking-tighter">
            830<span className="text-[#7e30e1]">+</span>
          </p>
          <p className="text-[26px] font-medium leading-10 tracking-tighter mt-5 mb-2">
            Breaches Detected
          </p>
          <p className="text-base text-center text-[#a7a7a7] font-normal leading-10 tracking-tighter">
            On the Dark Web
          </p>
        </div>
      </div>
    </div>
  );
}
