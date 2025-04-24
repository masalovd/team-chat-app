"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { open, setOpen } = useCreateChannelModal();

  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => currentMember?.role === "admin", [currentMember?.role]);

  useEffect(() => {
    if (isWorkspaceLoading || isChannelsLoading || isCurrentMemberLoading || !currentMember || !workspace) return;

    if (channelId) {
      router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isAdmin,
    channelId,
    workspaceId,
    isWorkspaceLoading,
    isChannelsLoading,
    isCurrentMemberLoading,
    currentMember,
    workspace,
    open,
    router,
    setOpen
  ])

  if (isWorkspaceLoading || isChannelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
}

export default WorkspaceIdPage;
