import { ChangeEvent, FormEvent, useState } from "react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateChannel } from "../api/use-create-channel";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Label } from "@/components/ui/label";

export const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { open, setOpen } = useCreateChannelModal();

  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setDescription("");
    setOpen(false);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name,
        description,
        workspaceId,
      },
      {
        onSuccess: (channelId) => {
          router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
          handleClose();
          toast.success("Channel has been created successfully!");
        },
        onError: () => {
          toast.error("Failed to create channel!");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="channel-name" className="text-sm font-medium text-gray-700">
              Channel name
            </Label>
            <Input
              id="channel-name"
              value={name}
              onChange={handleValueChange}
              disabled={isPending}
              autoFocus
              placeholder="e.g. plan-budget"
              required
              minLength={3}
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Input
              id="channel-description"
              value={description}
              onChange={handleDescriptionChange}
              disabled={isPending}
              placeholder="e.g. Channel for planning a budget"
              required
              minLength={3}
              maxLength={150}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
