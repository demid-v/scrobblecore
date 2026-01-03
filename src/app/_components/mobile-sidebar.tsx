import { api } from "~/trpc/server";

import MobileSidebarInner from "./mobile-sidebar-inner";

const MobileSidebar = async () => {
  const user = await api.auth.user();

  if (!user) return null;

  return <MobileSidebarInner />;
};

export default MobileSidebar;
