import React from "react";

import { api } from "~/trpc/server";

import ResizableHistory from "./resizable-history";
import ResizableHistoryGroup from "./resizable-history-group";

const ResizableHistoryLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await api.auth.user();

  if (!user) return children;

  return (
    <ResizableHistoryGroup main={children}>
      <ResizableHistory />
    </ResizableHistoryGroup>
  );
};

export default ResizableHistoryLayout;
