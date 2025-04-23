"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />
  };

  if (!user) {
    return null;
  };

  const { name, image } = user;
  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="rounded-md size-10 hover:opacity-75 transition">
          <AvatarImage className="rounded-md" alt={name} src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()} className="h-10">
            <LogOut className="size-4 mr-1.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};