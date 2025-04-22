import { UserButton } from "@/app/features/auth/components/user-button";
import WorkspaceSwitcher from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { GalleryVerticalEnd, Home, MessageCircle } from "lucide-react";

export const Sidebar = () => {
  // TODO: Add switching functionality between home, messages, and channels
  return (
    <aside className="w-[70px] h-full bg-[#7F92DC] flex flex-col gap-y-4 items-center pt-[9px] pb-3">
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive={true} />
      <SidebarButton icon={MessageCircle} label="Messages" isActive={false} />
      <SidebarButton icon={GalleryVerticalEnd} label="Channels" isActive={false} />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}