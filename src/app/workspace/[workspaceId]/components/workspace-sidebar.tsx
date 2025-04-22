import { Loader, TriangleAlert } from "lucide-react";

import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: currentWorkspace, isLoading: isCurrentWorkspaceLoading } = useGetWorkspace({ id: workspaceId })

  if (isCurrentMemberLoading || isCurrentWorkspaceLoading) {
    return (
      <div className="flex flex-col bg-[#aebeff] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!currentMember || !currentWorkspace) {
    return (
      <div className="flex flex-col bg-[#aebeff] h-full items-center justify-center">
        <TriangleAlert className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#aebeff] h-full">
      <WorkspaceHeader workspace={currentWorkspace} isAdmin={currentMember.role === "admin"} />
    </div>
  );
}