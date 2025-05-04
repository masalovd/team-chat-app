import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FileMetadata } from "convex/server";
import {
  FileText,
  FileType2,
  FileSpreadsheetIcon,
  PlayIcon,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThumbnailProps {
  url: string | null | undefined;
  authorName: string;
  filename: string | undefined;
  metadata?: FileMetadata | null;
}

export const Thumbnail = ({ url, authorName, filename, metadata }: ThumbnailProps) => {
  if (!url) return null;

  const contentType = metadata?.contentType;

  const getCursorClass = () => {
    if (contentType?.startsWith("image/")) return "cursor-zoom-in";
    return "cursor-pointer";
  };

  const renderThumbnail = () => {
    if (contentType?.startsWith("image/")) {
      return (
        <img
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"
        />
      );
    }

    if (contentType?.startsWith("video/")) {
      return (
        <div className="relative w-full h-full">
          <video
            src={url}
            className="rounded-md object-cover size-full"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-2">
              <PlayIcon className="text-white size-6" />
            </div>
          </div>
        </div>
      );
    }

    if (contentType?.startsWith("audio/")) {
      // return (
      //   <div className="flex flex-col items-center justify-center h-[80px] px-4">
      //     <FileAudio2 className="size-6 text-blue-500 mb-2" />
      //     <p className="text-xs text-muted-foreground">Audio file</p>
      //   </div>

      // );
      return <audio src={url} controls className="w-full my-4" />;
    }

    if (contentType === "application/pdf") {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <FileText className="size-6 text-red-500 mb-1" />
          <p className="text-xs text-muted-foreground">{filename}</p>
        </div>
      );
    }

    if (contentType === "application/msword" ||
      contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <FileType2 className="size-6 text-sky-500 mb-1" />
          <p className="text-xs text-muted-foreground">{filename}</p>
        </div>
      );
    }

    if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <FileSpreadsheetIcon className="size-6 text-green-500 mb-1" />
          <p className="text-xs text-muted-foreground">{filename}</p>
        </div>
      );
    }

    if (contentType?.startsWith("text/")) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <FileText className="size-6 text-slate-500 mb-1" />
          <p className="text-xs text-muted-foreground">{filename}</p>
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
      return (
        <img
          src={url}
          alt="Full image"
          className="rounded-md object-contain max-h-[80vh] mx-auto"
        />
      );
    }

    if (contentType?.startsWith("video/")) {
      return (
        <video
          src={url}
          controls
          autoPlay
          loop
          className="rounded-md object-contain max-h-[80vh] mx-auto"
        />
      );
    }

    if (contentType === "application/pdf") {
      return (
        <iframe
          src={url}
          className="w-full h-[80vh] rounded-md"
          title="PDF document"
        />
      );
    }

    if (contentType?.startsWith("audio/")) {
      return <audio src={url} controls className="w-full my-4" />;
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 px-6 bg-muted rounded-md">
        <FileWarning className="text-gray-400 size-10" />
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1 font-medium">
            Preview not available for this file type.
          </p>
          <a
            href={url}
            download
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Click here to download the file
          </a>
        </div>
      </div>
    );
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "relative overflow-hidden max-w-[360px] rounded-lg my-2",
            getCursorClass(),
            !contentType?.startsWith("audio/") && "border"
          )}>
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
