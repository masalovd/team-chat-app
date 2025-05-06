import React from "react";

import { PlusIcon } from "lucide-react";
import { FaCaretRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/reusables/hint";

import { cn } from "@/lib/utils";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center group px-2 mt-3 shrink-0">
        <Button
          variant="transparent"
          className="p-0.5 text-sm text-[#F9EDFFCC] shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretRight
            className={cn("size-4 transition-transform", on && "rotate-90")}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[#F9EDFFCC] h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              variant="transparent"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#F9EDFFCC] size-6 shrink-0"
              onClick={onNew}
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      <div className="overflow-y-auto px-2 space-y-1 py-1 workspace-section-scrollbar">
        {on ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs italic text-[#F9EDFF99] text-center">
              Toggle {label.toLowerCase()} to see them
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
