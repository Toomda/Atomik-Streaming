import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";

interface DirectMessageListProps {
  onSelectChat: (chat: DirectMessageChat) => void;
  directMessageChats: DirectMessageChat[];
}

export const DirectMessageList = ({
  onSelectChat,
  directMessageChats,
}: DirectMessageListProps) => {
  const sortedChats = directMessageChats.sort((a, b) => {
    if (!a.chatRead && b.chatRead) return -1;
    if (a.chatRead && !b.chatRead) return 1;

    const aNewestMessageDate = new Date(
      a.messages[a.messages.length - 1]?.createdAt
    );
    const bNewestMessageDate = new Date(
      b.messages[b.messages.length - 1]?.createdAt
    );

    return bNewestMessageDate.getTime() - aNewestMessageDate.getTime();
  });

  return (
    <ScrollArea className="h-52 w-96">
      {sortedChats.map((chat) => {
        return (
          <div
            key={chat.partnerId}
            onClick={() => onSelectChat(chat)}
            className={cn(
              "cursor-pointer hover:bg-slate-400 hover:bg-opacity-10",
              !chat.chatRead &&
                "bg-red-500 bg-opacity-10 hover:bg-opacity-20 hover:bg-red-500"
            )}
          >
            <div className="flex items-center space-x-3 p-2">
              <UserAvatar
                imageUrl={chat.partnerDetails.image}
                username={chat.partnerDetails.username}
                size={"md"}
              />
              <div className="flex flex-col max-w-xs">
                <p className="text-md">{chat.partnerDetails.username}</p>
                <p className="text-muted-foreground italic truncate pr-1">
                  {chat.messages[chat.messages.length - 1].sendBy.username}:{" "}
                  {chat.messages[chat.messages.length - 1].text}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </div>
        );
      })}
    </ScrollArea>
  );
};
