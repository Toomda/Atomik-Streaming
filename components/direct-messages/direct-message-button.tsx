"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { DirectMessageList } from "./direct-message-list";
import { DirectMessageChat } from "./direct-message-chat";
import { DirectMessageHeader } from "./direct-message-header";
import { useDirectMessages } from "@/context/direct-message-context";

interface DirectMessageProps {
  username: string;
}

export const DirectMessageButton = ({ username }: DirectMessageProps) => {
  const { sendDirectMessage, directMessageChats, selectedChat, setChat } =
    useDirectMessages();

  const unreadChats = directMessageChats.filter(
    (chat) => chat.chatRead === false
  );

  const onChatClick = (chat: DirectMessageChat) => {
    setChat(chat);
  };

  const handleChatLeave = () => {
    setChat(null);
  };

  const onOpenChangeDropdown = (open: boolean) => {
    if (!open) setChat(null);
  };

  return (
    <DropdownMenu onOpenChange={onOpenChangeDropdown}>
      <DropdownMenuTrigger
        className="text-muted-foreground hover:text-primary min-w-[80px]"
        asChild
      >
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-primary relative"
        >
          {unreadChats.length !== 0 && (
            <span className="bg-rose-500 text-center px-1.5 rounded-full uppercase text-[12px] text-white absolute top-0 left-0 font-semibold tracking-wide">
              {unreadChats.length}
            </span>
          )}
          <MessageSquare className="h-5 w-5 mt-1 mr-2" />
          <span className="hidden lg:block">DM</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-2 border-gray-400 border-opacity-20 p-0"
      >
        <div className="w-96">
          <DirectMessageHeader
            selectedChat={selectedChat}
            handleChatLeave={handleChatLeave}
          />
          {directMessageChats.length === 0 && <div>No Chats</div>}
          {directMessageChats.length > 0 && (
            <>
              {!selectedChat ? (
                <DirectMessageList
                  onSelectChat={onChatClick}
                  directMessageChats={directMessageChats}
                />
              ) : (
                <DirectMessageChat
                  selectedChat={selectedChat}
                  username={username}
                  sendDirectMessage={sendDirectMessage}
                />
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
