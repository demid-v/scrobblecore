"use client";

import dynamic from "next/dynamic";

const MobileSidebarInner = dynamic(
  () => import("./mobile-sidebar-inner-client"),
  {
    ssr: false,
  },
);

export default MobileSidebarInner;
