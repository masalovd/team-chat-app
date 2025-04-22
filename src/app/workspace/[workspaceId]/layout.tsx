"use client";

import { Sidebar } from "./components/sidebar";
import { Toolbar } from "./components/toolbar";
import { WorkspaceSidebar } from "./components/workspace-sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
};

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId={"tca-workspace-layout"}>
          <ResizablePanel defaultSize={20} minSize={12} className="bg-[#aebeff]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;