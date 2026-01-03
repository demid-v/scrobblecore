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
    <div className="bg-sidebar flex h-12 items-center justify-between overflow-hidden border-b px-2">
      <div className="font-semibold">History</div>
      <HistoryFilter />
    </div>
    <History />
  </aside>
);

const MobileSidebarHistory = () => (
  <SidebarGroup className="h-[calc(100%-260px)] pb-0">
    <SidebarGroupLabel className="flex h-auto justify-between py-2">
      <div>History</div>
      <HistoryFilter />
    </SidebarGroupLabel>
    <SidebarGroupContent className="overflow-auto">
      <History />
    </SidebarGroupContent>
  </SidebarGroup>
);

export default HistorySidebar;
export { MobileSidebarHistory };
