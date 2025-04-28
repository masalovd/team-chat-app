import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 15;

interface useGetMessagesProps {
  conversationId?: Id<"conversations">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const useGetMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: useGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      parentMessageId,
      conversationId,
    },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
