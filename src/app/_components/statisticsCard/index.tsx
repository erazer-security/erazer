import React from "react";

interface StatisticsCardProps {
  heading: string;
  value: number;
  description: string;
  className?: string;
}

export default function StatisticsCard({
  className,
  heading,
  value,
  description,
}: StatisticsCardProps) {
  return (
    <div className={`h-fit bg-[#EFE3FF] rounded-2xl px-9 py-6 ${className}`}>
      <div className="gap-4">
        <p className="text-[#23242A] text-base font-medium leading-[20.8px] tracking-[0.32px]">
          {heading}
        </p>
        <div className="flex flex-row items-center gap-2">
          <p className="text-[#23242A] text-[34px] font-medium leading-[44.2px] tracking-[0.68px]">
            {value}
          </p>
          <p className="text-[#095353] text-[12px] leading-[18px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
