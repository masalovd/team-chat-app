"use client";

import { AlertTriangle, Loader } from "lucide-react";

import { Header } from "./components/header";
import { ChatInput } from "./components/chat-input";

import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: isChannelLoading } = useGetChannel({ id: channelId });

  if (isChannelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">Channel not found</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={"Write a message"} />
    </div>
  );
}

export default ChannelIdPage;