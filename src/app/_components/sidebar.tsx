"use client";

import dynamic from "next/dynamic";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";

import HistoryFilter from "./history-filter";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => (
  <aside className="flex h-full flex-col">
    <div className="flex h-12 items-center justify-between overflow-hidden border-b bg-sidebar px-2">
      <div className="font-semibold">History</div>
      <HistoryFilter />
    </div>
    <History />
  </aside>
);

const MobileSidebarHistory = () => (
  <SidebarGroup className="flex-1">
    <SidebarGroupLabel className="mb-2 flex justify-between">
      <div>History</div>
      <HistoryFilter />
    </SidebarGroupLabel>
    <SidebarGroupContent className="flex h-full">
      <History />
    </SidebarGroupContent>
  </SidebarGroup>
);

export default HistorySidebar;
export { MobileSidebarHistory };
