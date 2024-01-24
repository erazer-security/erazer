"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useToast } from "@/components/ui/use-toast";

export default function Community() {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");

  function addToWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim() === "") {
      toast({
        variant: "destructive",
        description: "Please enter your email.",
      });
      return;
    }

    emailjs.sendForm(
      `${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID}`,
      `${process.env.NEXT_PUBLIC_EMAILJS_WAITLIST_TEMPLATE_ID}`,
      event.target as HTMLFormElement,
      `${process.env.NEXT_PUBLIC_EMAILJS_API_KEY}`
    );

    setEmail("");
    toast({
      variant: "success",
      description: "You have been added to the waitlist.",
    });
  }

  return (
    <div className="lg:h-[530px] bg-[#ffffff0d] flex flex-col lg:flex-row lg:justify-around lg:items-center -mx-5 md:-mx-16 mt-48 py-14 lg:py-0">
      <div className="bg-[#0a0a0a] lg:-translate-y-24">
        <div className="overflow-hidden top-0 left-0 right-0 bottom-0 rounded-t-3xl bg-gradient-to-br from-[#7e30e140] to-[#49108b40]">
          <Image
            src="/community/facebook.svg"
            alt="Facebook"
            width={353}
            height={286}
            className="opacity-20"
          />
        </div>
        <div className="flex flex-col items-start gap-5 p-8">
          <Link
            href="https://www.facebook.com/groups/321264396948984/"
            target="_blank"
            className="bg-[#171717] rounded-xl px-10 py-1"
          >
            <Image
              src="/community/facebookButton.svg"
              alt="Facebook Button"
              width={92}
              height={49}
            />
          </Link>
          <h3 className="text-[32px] font-medium leading-[41.6px]">
            Join our Facebook <br /> community!
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-10 px-5">
        <h3 className="text-[32px] font-medium leading-[41.6px]">
          Sign up to our waitlist.
        </h3>
        <p className="lg:w-[525px] text-[#a7a7a7] text-[22px] font-normal leading-[28.6px] tracking-[0.44px]">
          Subscribe for alerts on our upcoming Dark Web Removal and Image
          Takedown features.
        </p>
        <form
          onSubmit={addToWaitlist}
          className="flex flex-row justify-between gap-5 p-4 rounded-[40px] border-[1px] border-solid border-[#31343D] backdrop-blur-xl"
        >
          <input
            autoComplete="off"
            type="email"
            name="from_email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your Email Address"
            className="text-white placeholder:text-white text-base font-normal bg-transparent outline-none"
          />
          <button
            type="submit"
            className="ml-auto flex justify-center items-center px-[18px] py-[10px] rounded-full bg-gradient-to-br from-[#7e30e1] to-[#49108b]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
