"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useState } from "react";
import { type ImperativePanelHandle } from "react-resizable-panels";

import { Button } from "~/components/ui/button";
import { ResizableHandle, ResizablePanel } from "~/components/ui/resizable";

import HistorySidebar from "./sidebar";

const ResizableHistory = ({
  defaultSize = 20,
}: {
  defaultSize: number | undefined;
}) => {
  const historyPanelRef = useRef<ImperativePanelHandle>(null);

  const [isExpanded, setIsExpanded] = useState(defaultSize !== 0);

  const toggleHistory = () => {
    const historyPanel = historyPanelRef.current;
    if (historyPanel === null) return;

    if (historyPanel.isExpanded()) historyPanel.collapse();
    else historyPanel.expand();
  };

  return (
    <>
      <div className="relative hidden md:block">
        <ResizableHandle className="h-full" />
        <Button
          variant="ghost"
          size="sm"
          className="absolute -left-1 top-0 z-50 h-7 w-7 -translate-x-full"
          title={isExpanded ? "Close history" : "Open history"}
          onClick={toggleHistory}
        >
          {isExpanded ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ResizablePanel
        ref={historyPanelRef}
        id="history"
        order={2}
        defaultSize={defaultSize}
        collapsible
        style={{
          overflow: "auto",
          height: "auto",
        }}
        className="hidden bg-sidebar transition-[flex-grow] md:block"
        onExpand={() => {
          setIsExpanded(true);
        }}
        onCollapse={() => {
          setIsExpanded(false);
        }}
      >
        <HistorySidebar />
      </ResizablePanel>
    </>
  );
};

export default ResizableHistory;
