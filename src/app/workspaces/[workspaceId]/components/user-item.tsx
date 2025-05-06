import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Id } from "../../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "text-[#7F92DC] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
  icon?: LucideIcon | IconType;
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
  icon: Icon,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        {Icon ? (
          <Icon className="size-5 mr-1 shrink-0" />
        ) : (
          <Avatar className="size-5 mr-1">
            <AvatarImage src={image} />
            <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
