import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/app/types/Profile";

interface RemovalsTableCardProps {
  profiles: Profile[];
  whoisDatabrokers: { [key: string]: string };
  className?: string;
}

export default function RemovalsTableCard({
  profiles,
  whoisDatabrokers,
  className,
}: RemovalsTableCardProps) {
  return (
    <div
      className={`bg-[#2E3033] flex flex-col gap-4 rounded-2xl px-8 py-5 ${className}`}
    >
      <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
        Overview
      </p>
      <ScrollArea className="h-[415px] w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-[#FFFFFF33]">
              <TableHead className="text-[#FFFFFF66] whitespace-nowrap">
                Removal Status
              </TableHead>
              <TableHead className="text-[#FFFFFF66]">Source</TableHead>
              <TableHead className="text-[#FFFFFF66]">
                Personal Information
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile: Profile, index: number) => (
              <TableRow
                key={index}
                className="border-none transition-colors hover:bg-[#23242A]"
              >
                <TableCell>
                  <div
                    className={`flex flex-row items-center ${
                      profile.status === "Pending"
                        ? "text-[#EFE3FF]"
                        : "text-[#43BEBE]"
                    }`}
                  >
                    <Image
                      src={
                        profile.status === "Pending"
                          ? "/removalsTableCard/pendingDot.svg"
                          : "/removalsTableCard/removedDot.svg"
                      }
                      alt="dot"
                      width={16}
                      height={16}
                    />
                    {profile.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-1">
                    {profile.website}{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Image
                            src="/removalsTableCard/tooltip.svg"
                            alt="Tooltip"
                            width={16}
                            height={16}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="w-[350px]">
                          {whoisDatabrokers[profile.website]}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="">
                    {profile.profile.slice(0, 75)}...{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Image
                            src="/removalsTableCard/tooltip.svg"
                            alt="Tooltip"
                            width={16}
                            height={16}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="w-[350px]">
                          {profile.profile}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
