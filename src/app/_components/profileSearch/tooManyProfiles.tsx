import React from "react";

interface TooManyProfilesProps {
  userCity: string;
  setUserCity: (userCity: string) => void;
  showSuggestedLocations: boolean;
  setShowSuggestedLocations: (showSuggestedLocations: boolean) => void;
  narrowProfiles: () => void;
  locations: string[];
}

export default function TooManyProfiles({
  userCity,
  setUserCity,
  showSuggestedLocations,
  setShowSuggestedLocations,
  narrowProfiles,
  locations,
}: TooManyProfilesProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="w-[275px] md:w-[350px] lg:w-[896px] text-[#a7a7a7] text-base text-left font-normal leading-[20.8px] tracking-[0.32px]">
        This may be a lot of profiles to go through. If you’d like, you can
        provide your city to narrow down the results. Or you can simply just go
        through all of them.
      </p>
      <div className="relative z-50 w-fit flex flex-row justify-between gap-5 p-2 rounded-[40px] border-[1px] border-solid border-[#31343D] backdrop-blur-xl">
        <input
          autoComplete="off"
          type="text"
          placeholder="City"
          value={userCity}
          onChange={(event) => setUserCity(event.target.value.toUpperCase())}
          onClick={() => setShowSuggestedLocations(true)}
          className="text-white placeholder:text-white text-base font-normal bg-transparent outline-none"
        />
        <button
          onClick={narrowProfiles}
          className="flex justify-center items-center px-4 py-2 rounded-full bg-gradient-to-br from-[#7E30E1] to-[#49108B] hover:from-[#3F0687] hover:to-[#36096A] active:from-[#100320] active:to-[#310267] transition-colors duration-100 ease-in-out"
        >
          Search
        </button>
        {showSuggestedLocations && (
          <ul className="absolute w-fit border border-[#31343D] rounded-3xl bg-[#16171F] p-5 top-16 left-0 empty:hidden">
            {locations
              .filter((location: string) => location.includes(userCity))
              .slice(0, 10)
              .map((location: string, index: number) => (
                <li
                  key={index}
                  className="text-left rounded-[4px] hover:bg-slate-400 hover:cursor-pointer"
                  onClick={() => {
                    setUserCity(location);
                    setShowSuggestedLocations(false);
                  }}
                >
                  {location}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
