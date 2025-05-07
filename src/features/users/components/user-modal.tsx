import React, { useState } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateUser } from "../api/use-update-user";
import { Id } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailIcon } from "lucide-react";
import Link from "next/link";

interface UserEditModalProps {
  userId: Id<"users">;
  initialName: string;
  initialEmail: string,
  initialImage: Id<"_storage"> | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const UserEditModal = ({
  userId,
  initialName,
  initialEmail,
  initialImage,
  open,
  setOpen,
}: UserEditModalProps) => {
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible.",
  );

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);

  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();


  const avatarFallback = name.charAt(0).toUpperCase();

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUser(
      {
        id: userId,
        name,
      },
      {
        onSuccess: () => {
          toast.success("User has been updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update a user!");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[128px] max-h-[128px] size-full">
                  <AvatarImage src={image} />
                  <AvatarFallback className="aspect-square text-6xl">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase text-gray-500 font-semibold">Username</p>
                    <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 break-words">{name}</p>
                </div>
              </DialogTrigger>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase text-gray-500 font-semibold">Email</p>
                </div>
                <p className="text-sm font-medium text-gray-800 break-words">{initialEmail}</p>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit username</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdateUser}>
                  <Input
                    value={name}
                    disabled={isUpdatingUser}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Username"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingUser}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingUser}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
};
