import { FaChevronDown } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
  isSelf?: boolean;
}

export const Header = ({
  memberImage,
  memberName = "Member",
  onClick,
  isSelf = false,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        onClick={onClick}
        disabled={isSelf}
      >
        {isSelf ? (
          <BookmarkIcon className="size-5 mr-2 text-black" />
        ) : (
          <Avatar className="size-6 mr-2">
            <AvatarImage src={memberImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        <span className="truncate">{memberName}</span>
        {!isSelf && <FaChevronDown className="size-2.5 ml-2" />}
      </Button>
    </div>
  );
};
