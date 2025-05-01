// useWorkspaceSidebar.ts
import { create } from "zustand";

type Tab = "home" | "messages" | "channels";

export const useWorkspaceSidebar = create<{
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
