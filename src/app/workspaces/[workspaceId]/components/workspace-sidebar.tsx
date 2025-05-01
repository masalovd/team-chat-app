import { HashIcon, LoaderIcon, MessageSquareText, SendHorizonal, TriangleAlert } from "lucide-react";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";
import { SidebarItem } from "./sidebar-item";
import { UserItem } from "./user-item";
import { useWorkspaceSidebar } from "@/features/workspaces/store/use-workspace-sidebar";

export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { activeTab } = useWorkspaceSidebar();

  const setOpen = useCreateChannelModal((state) => state.setOpen);

  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: currentWorkspace, isLoading: isCurrentWorkspaceLoading } = useGetWorkspace({ id: workspaceId })
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });


  if (isCurrentMemberLoading || isCurrentWorkspaceLoading) {
    return (
      <div className="flex flex-col bg-[#7F92DC] h-full items-center justify-center">
        <LoaderIcon className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!currentMember || !currentWorkspace) {
    return (
      <div className="flex flex-col bg-[#7F92DC] h-full items-center justify-center">
        <TriangleAlert className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-2 bg-[#7F92DC] h-full">
      <WorkspaceHeader
        workspace={currentWorkspace}
        member={currentMember}
        isAdmin={currentMember.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          id="threads"
          icon={MessageSquareText}
        />
        <SidebarItem
          label="Drafts and Sent"
          id="drafts"
          icon={SendHorizonal}
        />
      </div>
      {(activeTab === "home" || activeTab === "channels") && (
        <WorkspaceSection
          label="Channels"
          hint="New channel"
          onNew={currentMember.role === "admin" ? () => setOpen(true) : undefined}
        >
          {channels?.map((item) => (
            <SidebarItem
              key={item._id}
              id={item._id}
              label={item.name}
              icon={HashIcon}
              variant={item._id === channelId ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>
      )}
      {(activeTab === "home" || activeTab === "messages") && (
        <WorkspaceSection
          label="Direct messages"
          hint="New direct message"
        >
          {members?.map((item) => (
            <UserItem
              id={item._id}
              key={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>
      )}
    </div>
  );
}