"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { usePanelRef } from "react-resizable-panels";

import { Button } from "~/components/ui/button";
import { ResizableHandle, ResizablePanel } from "~/components/ui/resizable";
import { useIsMobile } from "~/hooks/use-mobile";

import HistorySidebar from "./sidebar";

const ResizableHistory = ({
  defaultSize = 20,
}: {
  defaultSize: number | undefined;
}) => {
  const historyPanelRef = usePanelRef();

  const [isExpanded, setIsExpanded] = useState(defaultSize !== 0);

  const isMobile = useIsMobile();
  if (isMobile) return null;

  const toggleHistory = () => {
    const historyPanel = historyPanelRef.current;
    if (historyPanel === null) return;

    if (historyPanel.isCollapsed()) historyPanel.expand();
    else historyPanel.collapse();
  };

  const onResize = () => {
    const historyPanel = historyPanelRef.current;
    if (!historyPanel) return;

    setIsExpanded(!historyPanel.isCollapsed());
  };

  return (
    <>
      <div className="relative">
        <ResizableHandle className="h-full after:hidden" />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 -left-1 z-50 h-7 w-7 -translate-x-full"
          title={isExpanded ? "Close history" : "Open history"}
          onClick={toggleHistory}
        >
          {isExpanded ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ResizablePanel
        panelRef={historyPanelRef}
        id="history"
        defaultSize={defaultSize === 0 ? defaultSize + "%" : defaultSize}
        collapsible
        minSize="250px"
        maxSize="45%"
        collapsedSize={0}
        onResize={onResize}
        className="bg-sidebar block transition-[flex-grow]"
      >
        <HistorySidebar />
      </ResizablePanel>
    </>
  );
};

export default ResizableHistory;
