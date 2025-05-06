import { Id } from "../../../../../../../convex/_generated/dataModel";

import { LoaderIcon } from "lucide-react";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/reusables/message-list";

import { usePanel } from "@/hooks/use-panel";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { onOpenProfile } = usePanel();
  const {
    data: currentMember,
    isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  const isSelfConversation = currentMember?._id === memberId;

  if (isMemberLoading || isCurrentMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={isSelfConversation ? "Saved messages" : member?.user.name}
        memberImage={isSelfConversation ? undefined : member?.user.image}
        onClick={isSelfConversation ? undefined : () => onOpenProfile(memberId)}
        isSelf={isSelfConversation}
      />
      <MessageList
        variant={"conversation"}
        data={results}
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Write a message to ${isSelfConversation ? "Saved messages" : member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
