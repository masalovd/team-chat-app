"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { GalleryVerticalEnd, Home, MessageCircle } from "lucide-react";
import { useWorkspaceSidebar } from "@/features/workspaces/store/use-workspace-sidebar";

export const Sidebar = () => {
  const { setActiveTab, activeTab } = useWorkspaceSidebar();

  return (
    <div className="w-[70px] h-full bg-[#5263a6] flex flex-col gap-y-4 items-center pt-[9px] pb-3">
      <WorkspaceSwitcher />
      <SidebarButton icon={Home}
        label="Home"
        isActive={activeTab === "home"}
        onClick={() => setActiveTab("home")}
      />
      <SidebarButton
        icon={MessageCircle}
        label="Messages"
        isActive={activeTab === "messages"}
        onClick={() => setActiveTab("messages")}
      />
      <SidebarButton
        icon={GalleryVerticalEnd}
        label="Channels"
        isActive={activeTab === "channels"}
        onClick={() => setActiveTab("channels")}
      />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </div>
  );
}