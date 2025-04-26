import Quill from "quill";
import dynamic from "next/dynamic";

import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { toast } from "sonner";

interface ChatInputProps {
  placeholder: string;
}

const Editor = dynamic(
  () => import("@/components/reusables/editor"), { ssr: false }
);

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  // TODO: Use imageRef to clear the editor after the message is sent,
  // TODO: don't re-render it every time with the help of this state 
  const [editorKey, setEditorKey] = useState(0);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId()

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image
  }: {
    body: string,
    image: File | null
  }) => {
    try {
      console.log(body, image);
      setIsPending(true);
      await createMessage({
        body,
        workspaceId,
        channelId
      }, { throwError: true })

      setEditorKey((prev) => prev + 1)
    } catch {
      toast.error("Failed to send a message!")
    } finally {
      setIsPending(false);
    };
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
}