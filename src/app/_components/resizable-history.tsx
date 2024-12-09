"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

import HistorySidebar from "./history-sidebar";

const ResizableHistory = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const ref = useRef<React.ComponentRef<typeof ResizablePanel>>(null);

  const toggleHistory = () => {
    const historyElement = ref.current;
    if (historyElement === null) return;

    if (historyElement.isExpanded()) historyElement.collapse();
    else historyElement.expand();
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="pt-12"
      style={{ height: "100vh" }}
    >
      <ResizablePanel
        defaultSize={80}
        style={{
          overflow: "auto",
          height: "auto",
        }}
      >
        {children}
      </ResizablePanel>
      <div className="relative">
        <ResizableHandle className="h-full" />
        <Button
          variant="ghost"
          size="sm"
          className="absolute -left-[3.25rem] top-0 z-50 h-7 w-7"
          title={isExpanded ? "Close history" : "Open history"}
          onClick={toggleHistory}
        >
          {isExpanded ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ResizablePanel
        ref={ref}
        defaultSize={20}
        collapsible
        style={{
          overflow: "auto",
          height: "auto",
        }}
        className="relative z-30 bg-sidebar transition-all"
        onExpand={() => {
          setIsExpanded(true);
        }}
        onCollapse={() => {
          setIsExpanded(false);
        }}
      >
        <HistorySidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizableHistory;
