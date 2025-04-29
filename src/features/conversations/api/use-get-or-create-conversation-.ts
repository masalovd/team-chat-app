import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

import { useCallback, useMemo, useState } from "react";

type RequestType = {
  workspaceId: Id<"workspaces">;
  memberId: Id<"members">;
};
type ResponseType = Id<"conversations"> | null;
type StatusType = "pending" | "success" | "error" | "settled" | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGetOrCreateConversation = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<StatusType>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  const mutation = useMutation(api.conversations.getOrCreate);

  const mutate = useCallback(
    async (args: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const conversationId = await mutation(args);
        setData(conversationId);
        setStatus("success");
        options?.onSuccess?.(conversationId);
        return conversationId;
      } catch (error) {
        setError(error as Error);
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    data,
    mutate,
    error,
    isPending,
    isSettled,
    isSuccess,
    isError,
  };
};
