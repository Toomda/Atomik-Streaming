"use client";

import React, { createContext, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getRoomInformation } from "@/actions/room";
import { isBannedByUser } from "@/actions/ban";

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
  const hostNameRef = useRef(initialHostName);
  const localViewerNameRef = useRef(initialLocalViewerName);
  const localViewerIdentityRef = useRef(initialLocalViewerIdentity);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const disconnectChat = () => {
      socketRef.current!.emit("disconnectChat", {
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
      console.log("Handle viewer left");
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

    const fetchRoomInfo = async () => {
      const roomInfo = await getRoomInformation(hostNameRef.current);
      const isBanned = await isBannedByUser(hostNameRef.current);

      console.log(isBanned);

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

    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);

      socketRef.current.on("chat-message", handleChatMessage);
      socketRef.current.on("viewer-joined", handleViewerJoined);
      socketRef.current.on("viewer-left", handleViewerLeft);
      socketRef.current.on("live-status", handleLiveStatus);
      socketRef.current.on("banned", handleBan);
      socketRef.current.on("unbanned", handleUnban);

      window.addEventListener("beforeunload", disconnectChat);
    }

    socketRef.current.emit("room-join", {
      hostName: hostNameRef.current,
      viewerName: localViewerNameRef.current,
      viewerIdentity: localViewerIdentityRef.current,
    });

    fetchRoomInfo();

    return () => {
      if (socketRef.current) {
        disconnectChat();
        window.removeEventListener("beforeunload", disconnectChat);
        socketRef.current.off("chat-message", handleChatMessage);
        socketRef.current.off("viewer-joined", handleViewerJoined);
        socketRef.current.off("viewer-left", handleViewerLeft);
        socketRef.current.off("live-status", handleLiveStatus);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    console.log(message);
    socketRef.current!.emit("chat-message", {
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
