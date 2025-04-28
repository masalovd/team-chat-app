import { MessageSquareIcon, PencilIcon, SmileIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReactions: (value: string) => void;
  hideThreadButton?: boolean;
}

export const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReactions,
  hideThreadButton
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="React with emoji"
          onEmojiSelect={(emoji) => handleReactions(emoji.native)}
        >
          <Button
            variant={"ghost"}
            size={"iconSm"}
            disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleEdit}
            >
              <PencilIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};