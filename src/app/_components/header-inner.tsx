"use client";

import dynamic from "next/dynamic";

import { HeaderSkeleton } from "./header-inner-client";

const HeaderInner = dynamic(() => import("./header-inner-client"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

export default HeaderInner;
