import { cookies } from "next/headers";
import React from "react";
import SuperJSON from "superjson";

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

  const layout = (await cookies()).get("react-resizable-panels:layout");

  const defaultLayout =
    typeof layout?.value !== "undefined"
      ? SuperJSON.parse<{ main: number; history: number }>(layout.value)
      : ({ main: 80, history: 20 } as const);

  return (
    <ResizableHistoryGroup main={children} defaultSize={defaultLayout.main}>
      <ResizableHistory defaultSize={defaultLayout.history} />
    </ResizableHistoryGroup>
  );
};

export default ResizableHistoryLayout;
