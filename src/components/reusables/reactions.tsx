import { cn } from "@/lib/utils";

import { Doc, Id } from "../../../convex/_generated/dataModel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { EmojiPopover } from "./emoji-popover";
import { SmilePlusIcon } from "lucide-react";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }>;
  onChange: (value: string) => void;
};

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;


  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <button
          key={reaction._id}
          onClick={() => onChange(reaction.value)}
          className={cn(
            "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
            reaction.memberIds.includes(currentMember._id) &&
            "bg-blue-100/70 border-blue-500 text-white"
          )}>
          {reaction.value}
          <span className={cn(
            "text-xs text-muted-foreground font-semibold",
            reaction.memberIds.includes(currentMember._id) &&
            "text-blue-500"
          )}
          >
            {reaction.count}
          </span>
        </button>
      ))
      }
      <EmojiPopover
        hint={"Add reaction"}
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent text-slate-800 hover:border-slate-500 flex items-center gap-x-1">
          <SmilePlusIcon className="size-4" />
        </button>
      </EmojiPopover>
    </div >
  );
};