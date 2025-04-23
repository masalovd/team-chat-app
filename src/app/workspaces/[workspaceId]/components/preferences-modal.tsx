import React, { useState } from "react";
import { TrashIcon } from "lucide-react";

import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  initialValue: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const PreferencesModal = ({
  initialValue,
  open,
  setOpen
}: PreferencesModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible."
  );

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

  const handleRemoveWorkspace = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeWorkspace({
      id: workspaceId,
    }, {
      onSuccess: () => {
        toast.success("Workspace has been removed!");
        router.replace("/");
      },
      onError: () => {
        toast.error("Failed to remove a workspace!")
      },
    })
  }

  const handleUpdateWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace({
      id: workspaceId,
      name: value
    }, {
      onSuccess: () => {
        toast.success("Workspace has been updated successfully!");
        setEditOpen(false);
      },
      onError: () => {
        toast.error("Failed to update a workspace!")
      },
    })
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>
              {value}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdateWorkspace}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g 'Family', 'Friends', 'Uni'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              disabled={isRemovingWorkspace}
              onClick={handleRemoveWorkspace}
              className="flex items-center justify-start gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}