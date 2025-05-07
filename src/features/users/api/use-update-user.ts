import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"users">;
  name: string;
};
type ResponseType = Id<"users"> | null;
type StatusType = "pending" | "success" | "error" | "settled" | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateUser = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<StatusType>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  const mutation = useMutation(api.users.update);

  const mutate = useCallback(
    async (args: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const userId = await mutation(args);
        setData(userId);
        setStatus("success");
        options?.onSuccess?.(userId);
        return userId;
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
    [mutation],
  );

  return {
    mutate,
    data,
    error,
    isPending,
    isSettled,
    isSuccess,
    isError,
  };
};
