import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
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
import { whoisDatabrokers } from "@/app/types/Databrokers";
import { Profile } from "@/app/types/Profile";

interface RemovalsTableCardProps {
  profiles: Profile[];
  className?: string;
}

export default function RemovalsTableCard({
  profiles,
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
        {profiles.length === 0 ? (
          <div className="h-full flex flex-col gap-4 items-center">
            <Image
              src="/removalsTableCard/noData.svg"
              alt="No Data"
              width={165}
              height={105}
            />
            <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
              No Profiles Found
            </p>
            <p className="text-[#B0B0B0] text-[12px] font-medium leading-[15.6px] tracking-[0.24px]">
              Please search for your profiles{" "}
              <Link href="/" className="underline decoration-solid">
                here
              </Link>
            </p>
          </div>
        ) : (
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
        )}
      </ScrollArea>
    </div>
  );
}
