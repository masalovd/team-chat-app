import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "../api/use-current-member";
import { useGetMember } from "../api/use-get-member";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useConfirm } from "@/hooks/use-confirm";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: member, isLoading: isMemberLoading } = useGetMember({ memberId });

  const { mutate: updateMember } = useUpdateMember();
  const { mutate: removeMember } = useRemoveMember();

  const [ConfirmLeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [ConfirmRemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );
  const [ConfirmChangeRoleDialog, confirmChangeRole] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role?"
  );

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() || "M";

  const handleRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember(
      {
        id: memberId,
      }, {
      onSuccess: () => {
        toast.success("Member removed");
        onClose();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to remove member");
      }
    });
  };

  const handleLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;
    removeMember(
      {
        id: memberId,
      }, {
      onSuccess: () => {
        toast.success("You left the workspace");
        onClose();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to leave the workspace");
      }
    });
  };

  const handleRoleChange = async (role: "admin" | "member") => {
    const ok = await confirmChangeRole();
    if (!ok) return;
    updateMember({
      id: memberId,
      role,
    }, {
      onSuccess: () => {
        toast.success("Role changed");
        onClose();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to changed role");
      }
    });
  };

  if (isMemberLoading || isCurrentMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5] " />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5] " />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmChangeRoleDialog />
      <ConfirmLeaveDialog />
      <ConfirmRemoveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5] " />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
            currentMember?._id !== memberId &&
            member.role !== "admin" && (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 capitalize">
                      {member.role} <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        handleRoleChange(role as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              </div>
            )}
          {currentMember?.role !== "admin" &&
            currentMember?._id === memberId && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLeave}
                >
                  Leave
                </Button>
              </div>
            )}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1255b4]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
