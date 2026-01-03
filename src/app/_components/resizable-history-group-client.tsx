"use client";

import { Layout } from "react-resizable-panels";
import SuperJSON from "superjson";

import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

const ResizableHistoryGroupClient = ({
  main,
  defaultSize = 80,
  children,
}: {
  main: React.ReactNode;
  defaultSize: number;
  children: React.ReactNode;
}) => {
  const onLayout = (layout: Layout) => {
    document.cookie = `react-resizable-panels:layout=${SuperJSON.stringify(layout)}`;
  };

  return (
    <ResizablePanelGroup
      id="body"
      orientation="horizontal"
      className="pt-12"
      style={{ height: "100vh" }}
      onLayoutChange={onLayout}
    >
      <ResizablePanel
        id="main"
        defaultSize={defaultSize === 100 ? defaultSize + "%" : defaultSize}
        className="relative"
        style={{
          overflow: "auto",
        }}
      >
        <div className="h-fit w-full">{main}</div>
      </ResizablePanel>
      {children}
    </ResizablePanelGroup>
  );
};

export default ResizableHistoryGroupClient;
