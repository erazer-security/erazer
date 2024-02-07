"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe-client";
import useUser from "@/lib/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Price } from "@/app/types/Price";

export default function Pricing() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user } = useUser();
  const [standardButtonText, setStandardButtonText] =
    useState<string>("Standard");
  const [premiumButtonText, setPremiumButtonText] = useState<string>("Premium");

  const freeFeatures: string[] = [
    "Scan the internet for your digital footprint",
    "Inspect data from over 75 data brokers",
    "See which domains are publishing your info",
    "Discover breached passwords and accounts",
  ];

  const standardFeatures: string[] = [
    "Scan the internet for your digital footprint",
    "Inspect data from over 75 data brokers",
    "See which domains are publishing your info",
    "Remove your info from predatory websites",
    "Discover breached passwords and accounts",
    "Watch Erazer secure your identity in real time",
  ];

  const premiumFeatures: string[] = [
    "Constantly scan the internet for your digital footprint",
    "Regularly scrape data from growing list of databrokers",
    "Gain access to monthly-updated databroker database",
    "Attain detailed report of personal security posturing",
    "Track breached passwords and accounts",
    "Remove your details as soon as they appear",
    "Watch Erazer secure your identity in real time",
  ];

  const handleBasicClick = () => {
    toast({
      variant: "success",
      description:
        "Search for your profile and then head to the dashboard to begin.",
    });
    router.push("/");
    return;
  };

  const handleStandardClick = () => {
    if (user && !user.paidForRemoval) {
      setStandardButtonText("Loading...");
      redirectToCheckout({
        priceID: `${process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID}`,
        type: "one_time",
      });
    } else {
      toast({
        variant: "success",
        description:
          "Search for your profile and then head to the dashboard to begin.",
      });
      router.push("/");
    }
    return;
  };

  const handlePremiumClick = () => {
    if (user && !user.paidForMonthlyRemoval) {
      setPremiumButtonText("Loading...");
      redirectToCheckout({
        priceID: `${process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID}`,
        type: "subscription",
      });
    } else {
      toast({
        variant: "success",
        description:
          "Search for your profile and then head to the dashboard to begin.",
      });
      router.push("/");
    }
    return;
  };

  const redirectToCheckout = async (price: Price) => {
    try {
      const { sessionId } = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ price }),
      }).then((res) => {
        if (!res.ok) {
          console.error("Error in creating checkout session", { res });
          toast({
            variant: "destructive",
            description:
              "There was an error while creating the checkout session. Please try again.",
          });
          throw Error(res.statusText);
        }
        return res.json();
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
      return console.error("Error in creating checkout session", { error });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-[50px] md:text-[56px] text-center font-medium leading-[55px] tracking-[-2.5px] mt-24 mb-28">
        Pricing for Your Peace of Mind
      </h2>

      <div className="flex flex-col lg:flex-row justify-evenly gap-20 lg:gap-10 w-full bg-[#ffffff0d] rounded-2xl backdrop-blur-xl px-5 py-10 md:px-10 lg:py-14 lg:pl-14">
        <div className="flex flex-col gap-10 lg:justify-between">
          <div>
            <h2 className="text-[56px] font-medium leading-10 tracking-tighter">
              Free
            </h2>
            <h3 className="text-[32px] font-medium leading-10 tracking-tighter my-5">
              Basic
            </h3>
            <div className="flex flex-col gap-4">
              {freeFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex flex-row gap-2 items-start">
                  <Image
                    src="/pricing/purpleCheckCircle.svg"
                    alt="Check Mark"
                    width={20}
                    height={20}
                  />
                  <p className="w-full text-[#a7a7a7a7] text-base font-normal leading-5 tracking-wider">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleBasicClick}
            className="w-full rounded-3xl bg-[#7e30e1] px-10 py-3 hover:bg-[#3F0687] active:bg-[#100320]"
          >
            Get Started
          </button>
        </div>

        <Image
          src="/pricing/line.svg"
          alt="Line"
          width={2}
          height={1}
          className="hidden lg:block h-full"
        />

        <div className="flex flex-col gap-10 lg:justify-between">
          <div>
            <h2 className="text-[56px] font-medium leading-10 tracking-tighter">
              $14.99
            </h2>
            <h3 className="text-[32px] font-medium leading-10 tracking-tighter my-5">
              Standard
            </h3>
            <div className="flex flex-col gap-4">
              {standardFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex flex-row gap-2 items-start">
                  <Image
                    src="/pricing/purpleCheckCircle.svg"
                    alt="Check Mark"
                    width={20}
                    height={20}
                  />
                  <p className="w-full text-[#a7a7a7a7] text-base font-normal leading-5 tracking-wider">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleStandardClick}
            className="w-full rounded-3xl bg-[#7e30e1] px-10 py-3 hover:bg-[#3F0687] active:bg-[#100320]"
          >
            {standardButtonText}
          </button>
        </div>

        <div className="flex flex-col gap-10 lg:justify-between rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#7e30e140] to-[#49108b40] py-10 px-10 lg:-mb-32 lg:-translate-y-24 ">
          <div className="w-fit bg-white text-[10px] text-[#49108B] font-extrabold rounded-full px-4 py-2 mb-2">
            <span>MOST POPULAR</span>
          </div>
          <div>
            <h2 className="text-[56px] font-medium leading-10 tracking-tighter">
              $9.99
              <span className="text-[22px] font-normal tracking-[0.44px]">
                /month
              </span>
            </h2>
            <h3 className="text-[32px] font-medium leading-10 tracking-tighter my-5">
              Premium
            </h3>
            <div className="flex flex-col gap-4">
              {premiumFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex flex-row gap-2 items-start">
                  <Image
                    src="/pricing/whiteCheckCircle.svg"
                    alt="Check Mark"
                    width={20}
                    height={20}
                  />
                  <p className="w-full text-base font-normal leading-5 tracking-wider">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handlePremiumClick}
            className="w-full rounded-3xl bg-white text-[#49108B] px-10 py-3 hover:bg-gray-200 active:bg-gray-300"
          >
            {premiumButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
