"use client";

import dynamic from "next/dynamic";

const ResizableHistory = dynamic(() => import("./resizable-history-client"), {
  ssr: false,
});

export default ResizableHistory;
