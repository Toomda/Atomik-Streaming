"use client";

import { getDirectMessages } from "@/actions/direct-message";
import useSocketStore from "@/store/use-socket";
import React, { useCallback, useEffect, useRef } from "react";
import { createContext, useState } from "react";

interface DirectMessageContext {
  directMessageChats: DirectMessageChat[];
  selectedChat: DirectMessageChat | null;
  setChat: (chat: DirectMessageChat | null) => void;
  sendDirectMessage: (sendBy: string, sendTo: string, text: string) => void;
}

const DirectMessageContext = createContext<DirectMessageContext | undefined>(
  undefined
);

interface DirectMessageProviderProps {
  children: React.ReactNode;
  username: string | undefined;
}

export const DirectMessageProvider = ({
  children,
  username,
}: DirectMessageProviderProps) => {
  const { socket } = useSocketStore();
  const [directMessageChats, setDirectMessageChats] = useState<
    DirectMessageChat[]
  >([]);
  const [selectedChat, setSelectedChat] = useState<DirectMessageChat | null>(
    null
  );
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

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
            chatRead: !fetchedMessages[partnerId].messages.some(
              (msg: DirectMessage) =>
                !msg.messageRead &&
                msg.sendTo.username.toLowerCase() === username?.toLowerCase()
            ),
          });
        }
      }

      setDirectMessageChats(messages);
    };
    fetchDirectMessages();
  }, []);

  useEffect(() => {
    const handleDirectMessageSuccess = (directMessage: DirectMessage) => {
      addMessageToSelectedChat(directMessage);
      setDirectMessageChats((prev) => {
        const partnerUsername = directMessage.sendTo.username;
        return prev.map((chat) => {
          if (chat.partnerDetails.username === partnerUsername) {
            const updatedMessages =
              chat.messages.length >= 10
                ? chat.messages.slice(1)
                : chat.messages;

            return {
              ...chat,
              messages: [...updatedMessages, directMessage],
            };
          }
          return chat;
        });
      });
    };

    const handleDirectMessageReceived = (directMessage: DirectMessage) => {
      addMessageToSelectedChat(directMessage);
      setDirectMessageChats((prev) => {
        const partnerUsername = directMessage.sendBy.username;
        return prev.map((chat) => {
          if (chat.partnerDetails.username === partnerUsername) {
            const updatedMessages =
              chat.messages.length >= 10
                ? chat.messages.slice(1)
                : chat.messages;

            const chatRead =
              selectedChatRef.current?.partnerDetails.username.toLowerCase() ===
              directMessage.sendBy.username.toLowerCase()
                ? true
                : false;

            if (chatRead && socket) {
              socket.emit("direct-message-chat-opened", {
                username: username,
                partnerName: chat?.partnerDetails.username,
              });
            }

            return {
              ...chat,
              chatRead: chatRead,
              messages: [...updatedMessages, directMessage],
            };
          }
          return chat;
        });
      });
    };

    if (socket) {
      console.log("register event hanlders");
      socket.on("direct-message-received", handleDirectMessageReceived);
      socket.on("direct-message-success", handleDirectMessageSuccess);
    }

    return () => {
      if (socket) {
        console.log("unregister event handlers");
        socket.off("direct-message-received", handleDirectMessageReceived);
        socket.off("direct-message-success", handleDirectMessageSuccess);
      }
    };
  }, [socket]);

  const addMessageToSelectedChat = (message: DirectMessage) => {
    setSelectedChat((prev) => {
      if (!prev) return null;

      return { ...prev, messages: [...prev.messages, message] };
    });
  };

  const setChat = (chat: DirectMessageChat | null) => {
    setSelectedChat(chat);

    if (socket && chat) {
      socket.emit("direct-message-chat-opened", {
        username: username,
        partnerName: chat?.partnerDetails.username,
      });
      const directMessageChat = directMessageChats.find(
        (msg) => msg.partnerId === chat.partnerId
      );

      if (
        directMessageChat?.messages.some(
          (message) =>
            !message.messageRead && message.sendTo.username === username
        )
      ) {
        setDirectMessageChats((prev) => {
          return prev.map((dm) => {
            if (dm.partnerId === chat.partnerId) {
              const updatedMessages = dm.messages.map((msg) => {
                msg.messageRead = true;
                return msg;
              });

              return {
                ...dm,
                chatRead: true,
                messages: [...updatedMessages],
              };
            }
            return dm;
          });
        });
      }
    }
  };

  const sendDirectMessage = (sendBy: string, sendTo: string, text: string) => {
    if (socket) {
      socket.emit("direct-message-send", {
        sendBy,
        sendTo,
        text,
      });
    }
  };

  return (
    <DirectMessageContext.Provider
      value={{
        sendDirectMessage,
        setChat,
        directMessageChats,
        selectedChat,
      }}
    >
      {children}
    </DirectMessageContext.Provider>
  );
};

export const useDirectMessages = () => {
  const context = React.useContext(DirectMessageContext);
  if (!context) {
    throw Error("tried to access DM context outside of component");
  }
  return context;
};
