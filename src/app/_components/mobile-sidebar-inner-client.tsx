import Link from "next/link";

import ScrobblecoreIcon from "~/components/scrobblecore-icon";
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

import { MobileSidebarHistory } from "./sidebar";

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

const MobileSidebarInnerClient = () => {
  return (
    <>
      <Sidebar className="md:hidden" sheetTitle="History">
        <SidebarHeader className="flex-row items-center gap-x-2">
          <ScrobblecoreIcon />
          <div className="text-xl font-semibold text-black">Scrobblecore</div>
        </SidebarHeader>
        <SidebarContent className="gap-0">
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
          <MobileSidebarHistory />
        </SidebarContent>
      </Sidebar>
      <div className="h-svh md:hidden">
        <SidebarTrigger className="fixed z-10 mt-12" />
      </div>
    </>
  );
};

export default MobileSidebarInnerClient;
