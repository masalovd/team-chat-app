"use client";

import { useState } from "react";
import { Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: workspace } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspaces/${workspaceId}/members/${memberId}`);
  };

  return (
    <nav className="bg-[#5263a6] flex items-center justify-between h-10 px-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max=[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Conversations">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogTrigger asChild>
            <Button variant="transparent" size="iconSm" onClick={() => setInfoOpen(true)}>
              <Info className="size-5 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About this app</DialogTitle>
              <DialogDescription>
                This is an open-source messaging app for teams and communities. Built with modern web technologies. Feel free to customize it!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-sm">
              <p>Visit the project on <a href="https://github.com/masalovd/team-chat-app" target="_blank" className="underline text-blue-500">GitHub</a>.</p>
              <p>Version: 1.0.0</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};
