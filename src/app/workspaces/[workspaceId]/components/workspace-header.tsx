import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Doc } from "../../../../../convex/_generated/dataModel";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/reusables/hint";

import { PreferencesModal } from "./preferences-modal";
import { InviteModal } from "./invite-modal";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRemoveMember } from "@/features/members/api/use-remove-member";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  member: Doc<"members">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  member,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useState(false);

  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const [ConfirmLeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?",
  );

  const { mutate: removeMember } = useRemoveMember();

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspaces/${workspaceId}/members/${memberId}`);
  };

  const handleLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;
    removeMember(
      {
        id: member._id,
      },
      {
        onSuccess: () => {
          toast.success("You left the workspace");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to leave the workspace");
        },
      },
    );
  };

  return (
    <>
      <ConfirmLeaveDialog />
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer py-2"
              onClick={() => setInviteOpen(true)}
            >
              Invite people to {workspace.name}
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
            {!isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={handleLeave}
                >
                  Leave
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversation" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button
              variant="transparent"
              size="iconSm"
              onClick={() => setOpen(true)}
            >
              <SquarePen className="size-4" />
            </Button>
          </Hint>
          <div>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Type a command or search..." />
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
        </div>
      </div>
    </>
  );
};
