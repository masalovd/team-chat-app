import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type ResponseType = string | null;
type StatusType = "pending" | "success" | "error" | "settled" | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<StatusType>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (_args: any, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const uploadUrl = await mutation();
        setData(uploadUrl);
        setStatus("success");
        options?.onSuccess?.(uploadUrl);
        return uploadUrl;
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
