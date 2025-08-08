"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("./toaster-client"), {
  ssr: false,
});

export default Toaster;
