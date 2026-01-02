"use client";

import dynamic from "next/dynamic";

const ResizableHistoryGroup = dynamic(
  () => import("./resizable-history-group-client"),
  {
    ssr: false,
  },
);

export default ResizableHistoryGroup;
