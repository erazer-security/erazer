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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
      {profiles.length === 0 ? (
        <div className="h-[350px] flex flex-col gap-4 justify-center items-center">
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
        <ScrollArea className="h-[350px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="border-[#FFFFFF33]">
                <TableHead className="text-[#FFFFFF66] whitespace-nowrap">
                  Removal Status
                </TableHead>
                <TableHead className="text-[#FFFFFF66]">Source</TableHead>
                <TableHead className="text-[#FFFFFF66] hidden md:table-cell">
                  Personal Information
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile: Profile, index: number) => (
                <React.Fragment key={index}>
                  <TableRow className="border-none transition-colors hover:bg-[#23242A]">
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
                    <WebsiteCell profile={profile} />
                    <ProfileCell
                      profile={profile}
                      className="hidden md:table-cell"
                    />
                  </TableRow>
                  <TableRow className="border-none md:hidden">
                    <ProfileCell
                      profile={profile}
                      colSpan={2}
                      className="pt-0"
                    />
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
}

type ProfileCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  profile: Profile;
};

const ProfileCell = ({ profile, ...tableCellProps }: ProfileCellProps) => {
  return (
    <TableCell {...tableCellProps}>
      {profile.profile.slice(0, 75)}...{" "}
      <div className="hidden md:block">
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
      <div className="block md:hidden">
        <Popover>
          <PopoverTrigger>
            <Image
              src="/removalsTableCard/tooltip.svg"
              alt="Tooltip"
              width={16}
              height={16}
            />
          </PopoverTrigger>
          <PopoverContent className="w-[350px]">
            {profile.profile}
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  );
};

const WebsiteCell = ({ profile }: ProfileCellProps) => {
  return (
    <TableCell>
      <div className="flex flex-row items-center gap-1">
        {profile.website}{" "}
        <div className="hidden md:block">
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
        <div className="block md:hidden">
          <Popover>
            <PopoverTrigger>
              <Image
                src="/removalsTableCard/tooltip.svg"
                alt="Tooltip"
                width={16}
                height={16}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[350px]">
              {whoisDatabrokers[profile.website]}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TableCell>
  );
};
