import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import React from "react";
import SuperJSON from "superjson";

import { api } from "~/trpc/server";

import ResizableHistory from "./resizable-history";

const ResizableHistoryGroup = dynamic(
  () => import("./resizable-history-group"),
  {
    loading: () => null,
  },
);

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
      ? SuperJSON.parse<[number, number]>(layout.value)
      : ([80, 20] as const);

  return (
    <ResizableHistoryGroup mainDefaultSize={defaultLayout[0]} main={children}>
      <ResizableHistory defaultSize={defaultLayout[1]} />
    </ResizableHistoryGroup>
  );
};

export default ResizableHistoryLayout;
