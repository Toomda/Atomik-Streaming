import { ArrowLeft } from "lucide-react";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

interface DirectMessageChatHeader {
  selectedChat: DirectMessageChat | null;
  handleChatLeave: () => void;
}

export const DirectMessageHeader = ({
  selectedChat,
  handleChatLeave,
}: DirectMessageChatHeader) => {
  return (
    <div className="mb-2">
      <div className="h-10 flex justify-between items-center font-semibold text-lg w-full px-2">
        {selectedChat && (
          <div className="flex-grow-0">
            <ArrowLeft
              className="flex-grow-0 cursor-pointer"
              onClick={handleChatLeave}
            />
          </div>
        )}
        <p className="text-center flex-grow">Direct Messages</p>
        {selectedChat && (
          <div className="flex-grow-0 opacity-0">
            <ArrowLeft className="flex-grow-0" />
          </div>
        )}
      </div>
      <DropdownMenuSeparator className="h-1" />
    </div>
  );
};
