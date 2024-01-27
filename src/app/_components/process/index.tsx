import Image from "next/image";

export default function Process() {
  return (
    <div className="mt-32 lg:mt-56 lg:mx-44">
      <h1 className="text-center text-[50px] md:text-[77px] font-medium leading-10 tracking-tighter">
        The Process
      </h1>
      {/* Mobile */}
      <div className="flex flex-col md:hidden items-center">
        <Image
          loading="lazy"
          src="/process/1.svg"
          alt="1"
          width={72}
          height={173}
        />
        <div className="flex flex-col items-center">
          <Image
            loading="lazy"
            src="/process/initialSearch.svg"
            alt="Initial Search Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full"
          />
          <h3 className="text-[32px] text-center font-medium leading-10 self-stretch mt-10">
            Initial Search
          </h3>
          <p className="text-neutral-400 text-[22px] text-center font-normal leading-7 tracking-wide mt-3.5">
            Enter basic details like name, age, and location.
          </p>
        </div>
        <Image
          loading="lazy"
          src="/process/2.svg"
          alt="2"
          width={72}
          height={173}
        />
        <div className="flex flex-col items-center">
          <Image
            loading="lazy"
            src="/process/comprehensiveScraping.svg"
            alt="Comprehensive Scraping Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full"
          />
          <h3 className="text-[32px] text-center font-medium leading-10 self-stretch mt-10">
            Comprehensive Scraping
          </h3>
          <p className="text-neutral-400 text-[22px] text-center font-normal leading-7 tracking-wide mt-3.5">
            Our system scans databrokers for matching info.
          </p>
        </div>
        <Image
          loading="lazy"
          src="/process/3.svg"
          alt="3"
          width={72}
          height={173}
        />
        <div className="flex flex-col items-center">
          <Image
            loading="lazy"
            src="/process/effortlessRemoval.svg"
            alt="Effortless Removal Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full"
          />
          <h3 className="text-[32px] text-center font-medium leading-10 self-stretch mt-10">
            Effortless Removal
          </h3>
          <p className="text-neutral-400 text-[22px] text-center font-normal leading-7 tracking-wide mt-3.5">
            One-click to erase your digital footprint.
          </p>
        </div>
      </div>
      {/* Tablet and Desktop */}
      <div className="hidden md:flex flex-row gap-5 px-5 mt-24">
        <div className="flex flex-col grow basis-[0%] items-end max-md:max-w-full">
          <Image
            loading="lazy"
            src="/process/initialSearch.svg"
            alt="Initial Search Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full"
          />
          <div>
            <h3 className="text-[32px] font-medium leading-10 mt-36">
              Comprehensive Scraping
            </h3>
            <p className="text-neutral-400 text-[22px] leading-7 tracking-wide mt-3.5">
              Our system scans databrokers for matching info.
            </p>
          </div>
          <Image
            loading="lazy"
            src="/process/effortlessRemoval.svg"
            alt="Effortless Removal Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full mt-36 max-md:mt-10"
          />
        </div>
        <Image
          loading="lazy"
          src="/process/123.svg"
          alt="123"
          width={72}
          height={72}
          className="aspect-[0.08] object-contain object-center overflow-hidden self-stretch shrink-0 max-w-full max-md:hidden"
        />
        <div className="flex flex-col grow basis-[0%] mt-10">
          <h3 className="text-[32px] font-medium leading-10 self-stretch">
            Initial Search
          </h3>
          <p className="text-neutral-400 text-[22px] leading-7 tracking-wide mt-6">
            Enter basic details like name, age, <br />
            and location.
          </p>
          <Image
            loading="lazy"
            src="/process/comprehensiveScraping.svg"
            alt="Comprehensive Scraping Image"
            width={255}
            height={255}
            className="aspect-[1.1] object-contain object-center overflow-hidden max-w-full mt-40 max-md:mt-10"
          />
          <h3 className="text-[32px] font-medium leading-10 self-stretch mt-40">
            Effortless Removal
          </h3>
          <p className="text-neutral-400 text-[22px] leading-7 tracking-wide mt-6">
            One-click to erase your digital footprint.
          </p>
        </div>
      </div>
    </div>
  );
}
