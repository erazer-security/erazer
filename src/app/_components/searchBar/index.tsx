"use client";
import React from "react";

interface SearchBarProps {
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setAge: (age: number) => void;
  setUserState: (userState: string) => void;
  searchProfile: () => void;
}

const states: string[] = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function SearchBar({
  setFirstName,
  setLastName,
  setAge,
  setUserState,
  searchProfile,
}: SearchBarProps) {
  return (
    <div className="w-fit flex flex-col md:flex-row px-5 pt-8 pb-[18px] md:py-4 justify-center md:items-center gap-5 md:gap-4 lg:gap-5 rounded-[40px] border-[1px] border-solid border-[#31343D] backdrop-blur-xl">
      <input
        autoComplete="off"
        autoFocus
        type="text"
        placeholder="First Name"
        onChange={(event) => setFirstName(event.target.value)}
        className="text-white placeholder:text-white text-base font-normal bg-transparent outline-none border-b-2 border-white md:w-[118px]"
      />
      <input
        autoComplete="off"
        type="text"
        placeholder="Last Name"
        onChange={(event) => setLastName(event.target.value)}
        className="text-white placeholder:text-white text-base font-normal bg-transparent outline-none border-b-2 border-white md:w-[118px]"
      />
      <div className="flex flex-row gap-5">
        <input
          autoComplete="off"
          type="number"
          placeholder="Age"
          onChange={(event) => setAge(parseInt(event.target.value))}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white placeholder:text-white text-base font-normal bg-transparent outline-none border-b-2 border-white md:w-[59px]"
        />
        <select
          defaultValue={"Default"}
          onChange={(event) => setUserState(event.target.value)}
          className="text-white text-base font-normal bg-transparent outline-none border-b-2 border-white md:w-[111px]"
        >
          <option value="Default" disabled>
            State
          </option>
          {states.map((state: string, index: number) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={searchProfile}
        className="flex justify-center items-center px-[18px] py-[10px] rounded-[100px] bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
      >
        Search
      </button>
    </div>
  );
}
