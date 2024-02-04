"use client";

import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { UserAvatar } from "./user-avatar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import useSocketStore from "@/store/use-socket";
import { getDirectMessages } from "@/actions/direct-message";

interface DirectMessage {
  id: string;
  text: string;
  sendBy: {
    username: string;
    image: string;
  };
  sendTo: {
    username: string;
    image: string;
  };
  createdAt: Date;
}

interface DirectMessageChat {
  partnerId: string;
  messages: DirectMessage[];
  partnerDetails: {
    username: string;
    image: string;
  };
}

interface DirectMessageProps {
  username: string;
}

export const DirectMessageButton = ({ username }: DirectMessageProps) => {
  const { socket } = useSocketStore();
  const [message, setMessage] = useState<string>("");
  const [directMessageChats, setDirectMessageChats] = useState<
    DirectMessageChat[]
  >([]);
  const [selectedChat, setSelectedChat] = useState<null | DirectMessageChat>(
    null
  );

  useEffect(() => {
    const fetchDirectMessages = async () => {
      const fetchedMessages = await getDirectMessages();
      let messages: DirectMessageChat[] = [];
      for (const partnerId in fetchedMessages) {
        if (fetchedMessages.hasOwnProperty(partnerId)) {
          messages.push({
            partnerId: partnerId,
            partnerDetails: fetchedMessages[partnerId].partnerDetails,
            messages: fetchedMessages[partnerId].messages.reverse(),
          });
        }
      }

      setDirectMessageChats(messages);
    };

    fetchDirectMessages();
  }, []);

  useEffect(() => {
    const handleDirectMessage = (directMessage: DirectMessage) => {
      console.log(directMessage);
      setSelectedChat((prev) => {
        if (prev === null) return null;
        return { ...prev, messages: [...prev.messages, directMessage] };
      });
    };

    if (socket) {
      socket.on("direct-message-received", handleDirectMessage);
      socket.on("direct-message-success", handleDirectMessage);
    }

    return () => {
      if (socket) {
        socket.off("direct-message-received", handleDirectMessage);
        socket.off("direct-message-success", handleDirectMessage);
      }
    };
  }, [socket]);

  const onChatClick = (chat: DirectMessageChat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  const onMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message || !socket || !selectedChat) return;

    socket.emit("direct-message-send", {
      sendBy: username,
      sendTo: selectedChat.partnerDetails.username,
      text: message,
    });

    setMessage("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="text-muted-foreground hover:text-primary"
        asChild
      >
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
        >
          <MessageSquare className="h-5 w-5 mt-1 mr-2" />
          <span className="hidden lg:block">DM</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-2 border-gray-400 border-opacity-20"
      >
        <div className="w-96">
          <div className="mb-2">
            <div className="h-10 flex justify-between items-center font-semibold text-lg w-full px-2">
              {selectedChat && (
                <div className="flex-grow-0">
                  <ArrowLeft
                    className="flex-grow-0 cursor-pointer"
                    onClick={handleBack}
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
          {!selectedChat ? (
            <ScrollArea className="h-52 w-96">
              {directMessageChats?.map((chat) => {
                return (
                  <div
                    key={chat.partnerId}
                    onClick={() => onChatClick(chat)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 p-2 ">
                      <UserAvatar
                        imageUrl={chat.partnerDetails.image}
                        username={chat.partnerDetails.username}
                        size={"md"}
                      />
                      <div className="flex flex-col max-w-xs">
                        <p className="text-md">
                          {chat.partnerDetails.username}
                        </p>
                        <p className="text-muted-foreground italic truncate">
                          {chat.messages[chat.messages.length - 1].text}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                  </div>
                );
              })}
            </ScrollArea>
          ) : (
            <div className="h-52 w-96 flex-col flex justify-end">
              <ScrollArea type="scroll">
                {selectedChat.messages.map((msg) => {
                  return (
                    <div key={msg.id} className="mb-2 flex space-x-1">
                      <p className="font-semibold">{msg.sendBy.username}</p>:
                      <p>{msg.text}</p>
                    </div>
                  );
                })}
              </ScrollArea>
              <form onSubmit={onMessageSend} className="flex space-x-2">
                <Input
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  value={message}
                  placeholder="Send a message..."
                />
                <Button type="submit" variant="primary">
                  Send
                </Button>
              </form>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
