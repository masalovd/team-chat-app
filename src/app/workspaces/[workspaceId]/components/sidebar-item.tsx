import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
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
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  disabled?: boolean;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  disabled,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  if (disabled) {
    return (
      <Button
        variant="transparent"
        className={cn(sidebarItemVariants({ variant }))}
        disabled={disabled}
      >
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="transparent"
      asChild
      className={cn(sidebarItemVariants({ variant }))}
    >
      {/* TODO: Make other routes to go not only to the channels */}
      <Link href={`/workspaces/${workspaceId}/channels/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
