"use client";

import dynamic from "next/dynamic";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "~/components/ui/sidebar";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => {
  return (
    <Sidebar className="mt-12 h-[calc(100svh-3rem)]" sheetTitle="History">
      <SidebarHeader className="ml-2 text-lg font-medium">
        History
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
};

export default HistorySidebar;
