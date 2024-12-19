"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useState } from "react";
import { type ImperativePanelHandle } from "react-resizable-panels";

import { Button } from "~/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api } from "~/trpc/react";

import HistorySidebar from "./sidebar";

const ResizableHistory = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const historyPanelRef = useRef<ImperativePanelHandle>(null);

  const { data: user } = api.auth.user.useQuery();

  const toggleHistory = () => {
    const historyPanel = historyPanelRef.current;
    if (historyPanel === null) return;

    if (historyPanel.isExpanded()) historyPanel.collapse();
    else historyPanel.expand();
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
      {user && (
        <>
          <div className="relative hidden md:block">
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
            ref={historyPanelRef}
            defaultSize={20}
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
      )}
    </ResizablePanelGroup>
  );
};

export default ResizableHistory;
