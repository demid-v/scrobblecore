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
import { api } from "~/trpc/server";

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

const MobileSidebar = async () => {
  const user = await api.auth.user();

  if (!user) return null;

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
          <MobileSidebarHistory />
        </SidebarContent>
      </Sidebar>
      <div className="h-svh md:hidden">
        <SidebarTrigger className="fixed z-10 mt-12" />
      </div>
    </>
  );
};

export default MobileSidebar;
