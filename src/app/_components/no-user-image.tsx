"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "~/components/ui/skeleton";

const NoUserImage = dynamic(() => import("./no-user-image-client"), {
  ssr: false,
  loading: () => <Skeleton className="h-[34px] w-[34px] rounded-full" />,
});

export default NoUserImage;
