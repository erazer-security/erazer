"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useUser from "@/lib/useUser";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  return isLoading ? (
    <div className="flex justify-center items-center space-x-4 h-screen">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ) : (
    children
  );
}
