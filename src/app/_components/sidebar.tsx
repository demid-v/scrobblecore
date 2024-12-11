"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { api } from "~/trpc/react";

import HistoryFilter from "./history-filter";

const History = dynamic(() => import("./history"), {
  ssr: false,
});

const HistorySidebar = () => (
  <aside>
    <div className="sticky top-0 flex items-center justify-between border-b bg-sidebar px-2 py-2">
      <div className="font-semibold">History</div>
      <HistoryFilter />
    </div>
    <History />
  </aside>
);

const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Search",
    url: "/search",
  },
  {
    title: "Albums",
    url: "/albums",
  },
  {
    title: "Tracks",
    url: "/tracks",
  },
  {
    title: "Artists",
    url: "/artists",
  },
  {
    title: "Track",
    url: "/track",
  },
];

const MobileSidebar = () => {
  const { data: user } = api.auth.user.useQuery();

  if (user == null) return null;

  return (
    <>
      <Sidebar className="md:hidden" sheetTitle="History">
        <SidebarHeader className="mx-2 text-lg font-medium">
          Scrobblecore
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 flex justify-between">
              <div>History</div>
              <HistoryFilter />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <History />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="h-svh md:hidden">
        <SidebarTrigger className="fixed ml-2 mt-14" />
      </div>
    </>
  );
};

export default HistorySidebar;
export { MobileSidebar };
