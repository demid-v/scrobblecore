"use client";

import dynamic from "next/dynamic";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "~/components/ui/sidebar";

import HistoryFilter from "./history-filter";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => (
  <Sidebar className="mt-12 h-[calc(100svh-3rem)]" sheetTitle="History">
    <SidebarHeader className="mx-2 flex flex-row justify-between text-lg font-medium">
      <div>History</div>
      <HistoryFilter />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <History />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default HistorySidebar;
