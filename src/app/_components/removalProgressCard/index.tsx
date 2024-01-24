import React from "react";
import { SemiCircleProgress } from "react-semicircle-progressbar";

interface RemovalProgressCardProps {
  profilesRemoved: number;
  percentage: number;
  removalProgressMessage: React.ReactNode;
  redirectToCheckout: () => void;
  className?: string;
}
const getColor = (percentage: number) => {
  if (percentage >= 0 && percentage <= 50) {
    return "#FF718B";
  } else if (percentage > 50 && percentage <= 75) {
    return "#FFEB3A";
  } else if (percentage > 75 && percentage <= 100) {
    return "#7FE47E";
  }
};

export default function RemovalProcessCard({
  profilesRemoved,
  percentage,
  removalProgressMessage,
  redirectToCheckout,
  className,
}: RemovalProgressCardProps) {
  return (
    <div className={`bg-[#2E3033] rounded-2xl px-8 py-5 ${className}`}>
      <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
        Removal Process
      </p>
      <div className="relative flex flex-col items-center">
        <SemiCircleProgress
          percentage={percentage}
          size={{
            width: 210,
            height: 200,
          }}
          strokeWidth={8}
          strokeColor={getColor(percentage)}
          hasBackground={true}
          bgStrokeColor="#000000"
          fontStyle={{
            fontSize: "0px",
            fontWeight: "normal",
            fill: "#FFFFFF",
          }}
        />
        <div className="absolute top-1/2 mx-auto text-center gap-2">
          <p className="text-[32px] font-medium leading-[44.2px] tracking-[0.68px]">
            {profilesRemoved}
          </p>
          <p className="text-base font-medium leading-[20.8px] tracking-[0.32px]">
            Profiles Removed
          </p>
        </div>
      </div>
      {removalProgressMessage}
    </div>
  );
}
