import { useQuery } from "convex/react";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface UseGetWorkspaceOptions {
  id: Id<"workspaces">;
}

export const useGetWorkspace = ({ id }: UseGetWorkspaceOptions) => {
  const data = useQuery(api.workspaces.getWorkspace, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
