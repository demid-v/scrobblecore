"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useDefaultLayout, usePanelRef } from "react-resizable-panels";

import { Button } from "~/components/ui/button";
import { ResizableHandle, ResizablePanel } from "~/components/ui/resizable";
import { useIsMobile } from "~/hooks/use-mobile";

import { cookieStorage, layoutId } from "./resizable-history-group-client";
import HistorySidebar from "./sidebar";

const ResizableHistory = () => {
  const historyPanelRef = usePanelRef();

  const { defaultLayout } = useDefaultLayout({
    id: layoutId,
    storage: cookieStorage,
  });

  const defaultSize = defaultLayout?.sidebar;

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
          title={isExpanded ? "Close history" : "Open sidebar"}
          onClick={toggleHistory}
        >
          {isExpanded ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ResizablePanel
        panelRef={historyPanelRef}
        id="sidebar"
        collapsible
        defaultSize={20}
        minSize="250px"
        maxSize="40%"
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
