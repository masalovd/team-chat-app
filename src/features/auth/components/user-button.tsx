"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderIcon, LogOut, UserPenIcon } from "lucide-react";
import { useState } from "react";
import { UserEditModal } from "@/features/users/components/user-modal";
import { Id } from "../../../../convex/_generated/dataModel";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data: user, isLoading } = useCurrentUser();
  const [userEditOpen, setUserEditOpen] = useState(false);

  if (isLoading) {
    return <LoaderIcon className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!user) {
    return null;
  }

  const { name, image } = user;
  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <>
      <UserEditModal
        userId={user._id}
        open={userEditOpen}
        setOpen={setUserEditOpen}
        initialName={user.name!}
        initialEmail={user.email!}
        initialImage={user.image as Id<"_storage">}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition">
            <AvatarImage alt={name} src={image} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="h-10 cursor-pointer py-2"
              onClick={() => setUserEditOpen(true)}
            >
              <UserPenIcon className="size-4 mr-1.5" />
              Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="h-10">
              <LogOut className="size-4 mr-1.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
