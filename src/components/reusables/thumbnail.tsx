import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FileMetadata } from "convex/server";

interface ThumbnailProps {
  url: string | null | undefined;
  authorName: string;
  metadata?: FileMetadata | null;
}

export const Thumbnail = ({ url, authorName, metadata }: ThumbnailProps) => {
  if (!url) return null;

  const contentType = metadata?.contentType;

  const renderThumbnail = () => {
    if (contentType?.startsWith("image/")) {
      return <img src={url} alt="Message image" className="rounded-md object-cover size-full" />;
    }

    if (contentType?.startsWith("video/")) {
      return (
        <video src={url} className="rounded-md object-cover size-full" muted />
      );
    }

    if (contentType?.startsWith("audio/")) {
      return (
        <audio src={url} controls className="w-full my-4 border-0" />
      );
    }

    if (contentType === "application/pdf") {
      return (
        <div className="flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">PDF File</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-sm text-gray-500">Unsupported file type</p>
      </div>
    );
  };

  const renderDialogContent = () => {
    if (contentType?.startsWith("image/")) {
      return <img src={url} alt="Full image" className="rounded-md object-contain max-h-[80vh] mx-auto" />;
    }

    if (contentType?.startsWith("video/")) {
      return (
        <video src={url} controls autoPlay loop className="rounded-md object-contain max-h-[80vh] mx-auto" />
      );
    }

    if (contentType === "application/pdf") {
      return (
        <iframe src={url} className="w-full h-[80vh] rounded-md" title="PDF document" />
      );
    }

    if (contentType?.startsWith("audio/")) {
      return (
        <audio src={url} controls className="w-full my-4" />
      );
    }

    return (
      <p className="text-gray-500 text-center py-4">
        Cannot preview this file type.
      </p>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          {renderThumbnail()}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <VisuallyHidden>
          <DialogTitle>File sent by {authorName}</DialogTitle>
        </VisuallyHidden>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );

};
