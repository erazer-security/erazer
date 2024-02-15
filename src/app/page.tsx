import CybersecurityStatistics from "@/app/_components/cybersecurityStatistics";
import Process from "@/app/_components/process";
import Testimonials from "@/app/_components/testimonials";
import Roadmap from "@/app/_components/roadmap";
import Pricing from "@/app/_components/pricing";
import WallOfHorror from "@/app/_components/wallOfHorror";
import Community from "@/app/_components/community";
import ProfileSearch from "@/app/_components/profileSearch";

export default function Home() {
  return (
    <div className="relative flex flex-col pb-10 lg:px-28">
      <h1 className="text-[50px] md:text-[77px] text-center font-medium mt-28 mb-5 leading-[55px] md:leading-[84.7px] tracking-[-2.5px] md:tracking-[-3.85px]">
        Discover and delete your <br />
        online footprint
      </h1>
      <p className="text-[22px] text-center font-normal mb-9 leading-[28.6px] tracking-[0.44px]">
        Get started with 1 click, remove yourself from 76 databrokers
      </p>
      <section id="profile-search">
        <div className="flex flex-row justify-center items-center">
          <ProfileSearch />
        </div>
      </section>
      <img
        src="/home/rings.svg"
        alt="Rings"
        className="absolute w-[1434px] h-[1555px] aspect-square z-[-1] top-[164px] md:top-[62px] lg:top-[-19px] left-0 right-0 mx-auto shrink-0"
      ></img>
      <CybersecurityStatistics />
      <section id="process">
        <Process />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="roadmap">
        <Roadmap />
      </section>
      <img
        src="/home/capa.svg"
        alt="Rings"
        className="absolute w-[1372px] h-[1372px] aspect-square z-[-1] top-[4400px] md:top-[3235px] lg:top-[3235px] left-0 right-0 mx-auto shrink-0"
      ></img>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="wall-of-horror">
        <WallOfHorror />
      </section>
      <section id="community">
        <Community />
      </section>
    </div>
  );
}
