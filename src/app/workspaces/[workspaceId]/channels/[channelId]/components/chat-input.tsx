import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import { Id } from "../../../../../../../convex/_generated/dataModel";

import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useCGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  file?: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import("@/components/reusables/editor"), {
  ssr: false,
});

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  // TODO: Use imageRef to clear the editor after the message is sent,
  // TODO: don't re-render it every time with the help of this state
  const [editorKey, setEditorKey] = useState(0);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useCGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    file,
  }: {
    body: string;
    file: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
        file: undefined,
      };

      if (file) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Failed to generate an upload URL!");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Failed to upload a file to the store!");
        }

        const { storageId } = await result.json();

        values.file = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prev) => prev + 1);
    } catch {
      toast.error("Failed to send a message!");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
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
};
