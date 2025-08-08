"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "./ui/skeleton";

const ScrobblecoreIcon = dynamic(
  () => import("~/components/scrobblecore-icon-client"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
  },
);

export default ScrobblecoreIcon;
