"use client";

import SuperJSON from "superjson";

import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

const ResizableHistoryGroupClient = ({
  mainDefaultSize,
  main,
  children,
}: {
  mainDefaultSize: number;
  main: React.ReactNode;
  children: React.ReactNode;
}) => {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${SuperJSON.stringify(sizes)}`;
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="history"
      className="pt-12"
      style={{ height: "100vh" }}
      onLayout={onLayout}
    >
      <ResizablePanel
        id="main"
        order={1}
        defaultSize={mainDefaultSize}
        style={{
          overflow: "auto",
          height: "auto",
        }}
      >
        {main}
      </ResizablePanel>
      {children}
    </ResizablePanelGroup>
  );
};

export default ResizableHistoryGroupClient;
