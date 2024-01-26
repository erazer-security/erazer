import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breach } from "@/app/types/Breach";

interface EmailBreachesCardProps {
  breaches: Breach[];
  className?: string;
}

export default function EmailBreachesCard({
  breaches,
  className,
}: EmailBreachesCardProps) {
  return (
    <div
      className={`bg-[#2E3033] flex flex-col gap-4 rounded-2xl px-8 py-5 ${className}`}
    >
      <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
        Email
      </p>
      {breaches ? (
        <>
          <p className="text=[#B0B0B0] text-[12px] font-medium leading-[15.6px] tracking-[0.24px]">
            Your Email has been has been found in a few breaches.
          </p>
          <ScrollArea className="h-[315px]">
            <Accordion type="single" collapsible>
              {breaches &&
                breaches.map((breach: Breach, index: number) => (
                  <AccordionItem
                    key={index}
                    value={breach.Title}
                    className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
                  >
                    <AccordionTrigger className="text-left">
                      {breach.Title} | {breach.BreachDate}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: breach.Description,
                        }}
                      ></p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </ScrollArea>
        </>
      ) : (
        <>
          <p className="text=[#B0B0B0] text-[12px] font-medium leading-[15.6px] tracking-[0.24px]">
            Please make sure you are following these best cybersecurity
            practices.
          </p>
          <ScrollArea className="h-[315px]">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="1"
                className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
              >
                <AccordionTrigger className="text-left">
                  Never reuse passwords for any account.
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  Reusing passwords increases the risk of multiple accounts
                  being compromised if one account&apos;s password is
                  discovered. Unique passwords for each account ensure that a
                  breach in one does not lead to a domino effect.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="2"
                className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
              >
                <AccordionTrigger className="text-left">
                  Make sure every account has multi-factor authentication
                  enabled.
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  Multi-factor authentication adds an extra layer of security by
                  requiring more than just a password to access an account.
                  Usually it&apos;ll ask you to confirm a login through another
                  device that you own. This makes it harder for unauthorized
                  users to gain access, even if they know your password.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="3"
                className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
              >
                <AccordionTrigger className="text-left">
                  Do not click on random links.
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  Random links can lead to malicious websites designed to steal
                  your information or infect your device with malware. Always
                  verify the source of a link before clicking. Usually you can
                  hover over a link, and your browser will tell you where it
                  will take you on the bottom left corner of your screen.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="4"
                className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
              >
                <AccordionTrigger className="text-left">
                  Keep your devices up to date.
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  Updates often include patches for security vulnerabilities.
                  Keeping devices up to date ensures you have the latest
                  protections against threats.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="5"
                className="w-full border border-[#ffffff1a] rounded-2xl px-3 mt-4"
              >
                <AccordionTrigger className="text-left">
                  Do not connect to public WiFi.
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  Public WiFi networks are often unsecured, since anyone can
                  access them. This makes it easy for hackers to intercept your
                  data. Avoid using them for sensitive activities to protect
                  your information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
