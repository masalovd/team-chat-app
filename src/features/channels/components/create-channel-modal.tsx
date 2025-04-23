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

export const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [name, setName] = useState("");

  const { open, setOpen } = useCreateChannelModal();

  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      name,
      workspaceId,
    })
      .then((channelId) => {
        // router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
        handleClose();
        toast.success("Channel has been created successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to create channel!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChange}
            disabled={isPending}
            autoFocus
            placeholder="e.g. plan-budget"
            required
            minLength={3}
            maxLength={80}
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};