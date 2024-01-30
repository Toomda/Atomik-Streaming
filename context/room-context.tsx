"use client";

import React, { createContext, useState, useEffect, useRef } from "react";
import { getRoomInformation } from "@/actions/room";
import { isBannedByUser } from "@/actions/ban";
import useSocketStore from "@/store/use-socket";

interface Participant {
  username?: string;
  image?: string;
  id?: string;
}

interface Room {
  remoteViewer: Participant[];
  hostName: string;
  localViewer: Participant;
  isLive: boolean;
  isBanned: boolean;
  isModerator: boolean;
  messages: ChatMessage[];
  guestViewer: number;
  sendMessage: (message: string) => void;
}

interface RoomProviderProps {
  children: React.ReactNode;
  initialHostName: string;
  initialLocalViewerName?: string;
  initialLocalViewerIdentity?: string;
  initialIsBanned: boolean;
}

export interface ChatMessage {
  timestamp: number;
  message: string;
  author: string;
}

const RoomContext = createContext<Room | undefined>(undefined);

export const RoomProvider = ({
  children,
  initialHostName,
  initialLocalViewerName,
  initialLocalViewerIdentity,
  initialIsBanned,
}: RoomProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [remoteViewer, setRemoteViewer] = useState<Participant[]>([]);
  const [guestViewer, setGuestViewer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isBanned, setIsBanned] = useState<boolean>(initialIsBanned);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const hostNameRef = useRef(initialHostName);
  const localViewerNameRef = useRef(initialLocalViewerName);
  const localViewerIdentityRef = useRef(initialLocalViewerIdentity);
  const { socket } = useSocketStore();

  useEffect(() => {
    const disconnectChat = () => {
      socket!.emit("disconnectChat", {
        hostName: hostNameRef.current,
        viewerName: localViewerNameRef.current,
      });
    };

    const handleChatMessage = (message: ChatMessage) => {
      setMessages((prev) => {
        if (prev.length === 50) prev.pop();

        return [...prev, message];
      });
    };

    const handleViewerJoined = (viewer: Participant) => {
      if (!viewer.username) {
        setGuestViewer((prev) => prev + 1);
        return;
      }
      setRemoteViewer((prev) => {
        if (prev.find((rv) => rv.username === viewer.username)) {
          return prev;
        }
        return [...prev, viewer];
      });
    };

    const handleViewerLeft = (viewer: Participant) => {
      if (!viewer.username) {
        setGuestViewer((prev) => prev - 1);
        return;
      }
      setRemoteViewer((prev) =>
        prev.filter((rv) => rv.username !== viewer.username)
      );
    };

    const handleLiveStatus = (isLive: boolean) => {
      setIsLive(isLive);
    };

    const handleBan = () => {
      setIsBanned(true);
    };

    const handleUnban = () => {
      setIsBanned(false);
    };

    const handleMod = () => {
      setIsModerator(true);
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `You are now a Moderator of this stream!`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const handleUnmod = () => {
      setIsModerator(false);
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `You are not a Moderator of this stream anymore.`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const handleBanSuccess = (username: string) => {
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `${username} has been banned!`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const handleUnbanSuccess = (username: string) => {
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `${username} has been unbanned!`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const handleModSuccess = (username: string) => {
      console.log("Got mod success!");
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `${username} is now a Moderator of this stream!`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const handleUnmodSuccess = (username: string) => {
      setMessages((prev) => {
        return [
          ...prev,
          {
            author: "",
            message: `${username} is not a Moderator of this stream anymore!`,
            timestamp: Date.now(),
          },
        ];
      });
    };

    const fetchRoomInfo = async () => {
      const roomInfo = await getRoomInformation(hostNameRef.current);
      const isBanned = await isBannedByUser(hostNameRef.current);

      setRemoteViewer((prev) => {
        const newViewer = roomInfo.viewer.map((viewer: any) => {
          if (!prev.find((rv) => rv.username === viewer.username)) {
            return viewer;
          }
        });

        return [...prev, ...newViewer].filter((x) => x !== undefined);
      });
      setMessages(roomInfo.messages);
      setIsLive(roomInfo.isLive);
      setGuestViewer(roomInfo.guestViewer);
      setIsBanned(isBanned);
    };

    if (socket) {
      socket.on("chat-message", handleChatMessage);
      socket.on("viewer-joined", handleViewerJoined);
      socket.on("viewer-left", handleViewerLeft);
      socket.on("live-status", handleLiveStatus);
      socket.on("banned", handleBan);
      socket.on("banned-success", handleBanSuccess);
      socket.on("unbanned", handleUnban);
      socket.on("unbanned-success", handleUnbanSuccess);
      socket.on("mod", handleMod);
      socket.on("mod-success", handleModSuccess);
      socket.on("unmod", handleUnmod);
      socket.on("unmod-success", handleUnmodSuccess);

      socket.emit("room-join", {
        hostName: hostNameRef.current,
        viewerName: localViewerNameRef.current,
        viewerIdentity: localViewerIdentityRef.current,
      });
    }

    window.addEventListener("beforeunload", disconnectChat);

    fetchRoomInfo();

    return () => {
      if (socket) {
        disconnectChat();
        window.removeEventListener("beforeunload", disconnectChat);
        socket.off("chat-message", handleChatMessage);
        socket.off("viewer-joined", handleViewerJoined);
        socket.off("viewer-left", handleViewerLeft);
        socket.off("live-status", handleLiveStatus);
        socket.off("banned", handleBan);
        socket.off("banned-success", handleBanSuccess);
        socket.off("unbanned", handleUnban);
        socket.off("unbanned-success", handleUnbanSuccess);
        socket.off("mod", handleMod);
        socket.off("mod-success", handleModSuccess);
        socket.off("unmod", handleUnmod);
        socket.off("unmod-success", handleUnmodSuccess);
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    console.log(message);
    socket!.emit("chat-message", {
      toChannel: hostNameRef.current,
      message: message,
      author: localViewerNameRef.current,
    });
  };

  return (
    <RoomContext.Provider
      value={{
        messages,
        sendMessage,
        hostName: hostNameRef.current,
        localViewer: {
          username: localViewerNameRef.current,
          id: localViewerIdentityRef.current,
        },
        isLive,
        remoteViewer,
        guestViewer,
        isBanned,
        isModerator,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = React.useContext(RoomContext);
  if (!context) {
    throw Error(
      "tried to access room context outside of StreamingRoom component"
    );
  }
  return context;
};
