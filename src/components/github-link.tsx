"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "./ui/skeleton";

const GithubLink = dynamic(() => import("~/components/github-link-client"), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
});

export default GithubLink;
