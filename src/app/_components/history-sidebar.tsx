"use client";

import dynamic from "next/dynamic";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "~/components/ui/sidebar";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => {
  return (
    <Sidebar className="mt-12 h-[calc(100svh-3rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <History />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default HistorySidebar;
