"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";

import { LoaderIcon, TriangleAlert } from "lucide-react";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetOrCreateConversation } from "@/features/conversations/api/use-get-or-create-conversation-";
import { Conversation } from "./components/conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useGetOrCreateConversation();

  useEffect(() => {
    mutate({ workspaceId, memberId }, {
      onSuccess: (conversationId) => {
        setConversationId(conversationId);
      },
      onError: () => {
        toast.error("Failed to get or create a conversation!")
      }
    })
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  };

  if (!conversationId) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  };

  return <Conversation id={conversationId} />;
}

export default MemberIdPage;