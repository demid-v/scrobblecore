"use client";

import { useDefaultLayout } from "react-resizable-panels";
import { type LayoutStorage } from "react-resizable-panels";

import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

const layoutId = "sidebar-layout";

const cookieStorage: LayoutStorage = {
  getItem(key) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === key) return value!;
    }

    return null;
  },
  setItem(key, value) {
    document.cookie = `${key}=${value}`;
  },
};

const ResizableHistoryGroupClient = ({
  main,
  children,
}: {
  main: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { defaultLayout, onLayoutChange } = useDefaultLayout({
    id: layoutId,
    storage: cookieStorage,
  });

  return (
    <ResizablePanelGroup
      id="body"
      orientation="horizontal"
      className="pt-12"
      style={{ height: "100vh" }}
      defaultLayout={defaultLayout}
      onLayoutChange={onLayoutChange}
    >
      <ResizablePanel
        id="main"
        className="relative"
        defaultSize={80}
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
export { layoutId, cookieStorage };
