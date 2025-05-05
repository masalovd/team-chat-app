import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useConfirm } from "@/hooks/use-confirm";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  title: string;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const currentMember = useCurrentMember({
    workspaceId,
  });

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible",
  );

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDesc(value);
  };

  const handleEditOpen = (open: boolean) => {
    if (currentMember.data?.role !== "admin") return;

    setEditOpen(open);
  };

  const handleClose = () => {
    setEditOpen(false);
    setName("");
    setDesc("");
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      {
        id: channelId,
        name: name,
        description: desc,
      },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      {
        id: channelId,
      },
      {
        onSuccess: () => {
          toast.success("Channel removed");
          router.replace(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to remove channel");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
              <span className="truncate"># {title}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <div className="px-5 py-4 bg-white rounded-lg border space-y-3 shadow-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">Channel name</p>
                  <p className="text-sm font-medium text-gray-800 break-words"># {title}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">Description</p>
                  <p className="text-sm text-gray-700 break-words">{description}</p>
                </div>
              </div>
              {currentMember.data?.role === "admin" && (
                <>
                  <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Channel</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Channel</DialogTitle>
                        <DialogDescription>
                          Make changes to your channel here. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={handleSave}>
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="channel-name"
                          value={name}
                          disabled={isUpdatingChannel}
                          onChange={handleValueChange}
                          required
                          autoFocus
                          minLength={3}
                          maxLength={80}
                          placeholder="e.g. plan-budget"
                        />
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          value={desc}
                          disabled={isUpdatingChannel}
                          onChange={handleDescriptionChange}
                          required
                          autoFocus
                          minLength={10}
                          maxLength={150}
                          placeholder="e.g. Channel for planning a budget"
                        />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isUpdatingChannel}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button disabled={isUpdatingChannel} type={"submit"}>Save</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    className="w-full py-3 flex items-center justify-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg font-medium text-sm transition"
                    onClick={handleRemove}
                    disabled={isRemovingChannel}
                  >
                    <TrashIcon className="size-4" />
                    Delete channel
                  </Button>

                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
