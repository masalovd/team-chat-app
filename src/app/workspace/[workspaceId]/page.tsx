"use client";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <div>
      <h1>Workspace</h1>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export default WorkspaceIdPage;
