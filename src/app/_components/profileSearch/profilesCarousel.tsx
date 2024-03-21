import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Profile } from "@/app/types/Profile";
import { databrokers } from "@/app/types/Databrokers";

interface ProfilesCarouselProps {
  setCarouselApi: (api: CarouselApi) => void;
  filteredProfiles: Profile[];
  selectedProfiles: Profile[];
  handleProfileAdd: (profile: Profile) => void;
  handleProfileRemove: (profile: Profile) => void;
}

export default function ProfilesCarousel({
  setCarouselApi,
  filteredProfiles,
  selectedProfiles,
  handleProfileAdd,
  handleProfileRemove,
}: ProfilesCarouselProps) {
  return (
    <>
      <Carousel
        setApi={setCarouselApi}
        className="h-[400px] lg:h-[250px] gap-4 border border-[#31343D] rounded-3xl backdrop-blur-xl p-5 md:px-10 md:py-7 min-w-0"
      >
        <CarouselContent>
          {filteredProfiles.map((profile: Profile, index: number) => (
            <CarouselItem key={index}>
              <div className="flex flex-col gap-5 ">
                <div className="h-64 lg:h-28 overflow-y-scroll border-b">
                  <p className="text-white text-base font-normal leading-[22.4px]">
                    {profile.profile}
                  </p>
                  {databrokers[profile.website].length > 1 && (
                    <p className="text-[#75778B] text-base font-normal leading-[22.4px]">
                      • This exact profile was found across{" "}
                      {databrokers[profile.website].length} websites •
                    </p>
                  )}
                </div>
                <div className="flex flex-row justify-center gap-5">
                  <CarouselNext
                    onClick={() => handleProfileAdd(profile)}
                    className={`w-fit h-fit text-sm font-medium rounded-full py-[10px] px-[18px] flex-shrink-0 transition-colors duration-100 ease-in-out hover:bg-gray-200 active:bg-gray-300 ${
                      selectedProfiles.includes(profile)
                        ? "text-white bg-[#7E30E1] hover:bg-[#3F0687] active:bg-[#100320]"
                        : "text-black bg-white hover:bg-gray-200 active:bg-gray-300"
                    }`}
                  >
                    This is me
                  </CarouselNext>
                  <CarouselNext
                    onClick={() => handleProfileRemove(profile)}
                    className="w-fit h-fit bg-white text-black text-sm font-medium rounded-full py-[10px] px-[18px] flex-shrink-0 transition-colors duration-100 ease-in-out hover:bg-gray-200 active:bg-gray-300"
                  >
                    Not me
                  </CarouselNext>
                </div>
                <div className="flex flex-row justify-center gap-5">
                  <CarouselPrevious>
                    <Image
                      src="/profileSearch/previousArrow.svg"
                      alt="Previous"
                      width={26}
                      height={1}
                    />
                  </CarouselPrevious>
                  <p>
                    {index + 1} of {filteredProfiles.length}
                  </p>
                  <CarouselNext>
                    <Image
                      src="/profileSearch/nextArrow.svg"
                      alt="Previous"
                      width={26}
                      height={1}
                    />
                  </CarouselNext>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
