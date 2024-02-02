import React from "react";
import Image from "next/image";

interface SearchBarProps {
  setPhoneNumber: (phoneNumber: string) => void;
  searchProfile: () => void;
}

export default function SearchBar({
  setPhoneNumber,
  searchProfile,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
        Expanded Search
      </p>
      <p className="text-[#B0B0B0] text-[12px] font-medium leading-[15.6px] tracking-[0.24px]">
        Search which databrokers have your phone number.
      </p>
      <div className="bg-[#2E3033] flex flex-row items-center rounded-2xl px-6 py-5">
        <input
          autoComplete="off"
          type="number"
          placeholder="Phone Number (Format: 1234567890)"
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  text-white placeholder:text-[#B0B0B0] text-base font-normal bg-transparent outline-none"
        />
        <button onClick={searchProfile} className="ml-auto">
          <Image
            src="/expandedSearchBar/searchIcon.svg"
            alt="Search Icon"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
