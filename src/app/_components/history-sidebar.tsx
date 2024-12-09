"use client";

import dynamic from "next/dynamic";

import HistoryFilter from "./history-filter";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => (
  <aside>
    <div className="sticky top-0 flex items-center justify-between border-b bg-sidebar px-2 py-4">
      <div className="font-semibold">History</div>
      <HistoryFilter />
    </div>
    <History />
  </aside>
);

export default HistorySidebar;
