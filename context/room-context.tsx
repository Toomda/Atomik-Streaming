'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';

interface Participant {
  username?: string;
  image?: string;
}

interface Room {
  remoteViewer: Participant[];
  hostName: string;
  localViewer: Participant;
  isLive: boolean;
  messages: ChatMessage[];
  guestViewer: number;
  sendMessage: (message: string) => void;
}

interface RoomProviderProps {
  children: React.ReactNode;
  initialHostName: string;
  initialLocalViewerName?: string;
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
}: RoomProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [remoteViewer, setRemoteViewer] = useState<Participant[]>([]);
  const [guestViewer, setGuestViewer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const hostNameRef = useRef(initialHostName);
  const localViewerNameRef = useRef(initialLocalViewerName);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const disconnectChat = () => {
      socketRef.current!.emit('disconnectChat', {
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
      if (viewer.username === localViewerNameRef.current) return;
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
      console.log('Handle viewer left');
      if (!viewer.username) {
        setGuestViewer((prev) => prev - 1);
        return;
      }
      setRemoteViewer((prev) =>
        prev.filter((rv) => rv.username !== viewer.username)
      );
    };

    const handleLiveStatus = (isLive: boolean) => {
      console.log('Got Live status change');
      setIsLive(isLive);
    };

    const fetchRoomInfo = async () => {
      let response: AxiosResponse;
      try {
        response = await axios.get(
          `http://localhost:5000/api/room/${hostNameRef.current}`
        );
      } catch (error) {
        throw new Error('Could not get Room info');
      }

      setRemoteViewer((prev) => {
        const newViewer = response.data.viewer.map((viewer: any) => {
          if (!prev.find((rv) => rv.username === viewer.username)) {
            return viewer;
          }
        });

        return [...prev, ...newViewer].filter((x) => x !== undefined);
      });
      setMessages(response.data.messages);
      setIsLive(response.data.isLive);
      setGuestViewer(response.data.guestViewer);
    };

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000/');

      socketRef.current.on('chat-message', handleChatMessage);

      socketRef.current.on('viewer-joined', handleViewerJoined);

      socketRef.current.on('viewer-left', handleViewerLeft);

      socketRef.current.on('live-status', handleLiveStatus);

      window.addEventListener('beforeunload', disconnectChat);
    }

    socketRef.current.emit('room-join', {
      hostName: hostNameRef.current,
      viewerName: localViewerNameRef.current,
    });

    fetchRoomInfo();

    return () => {
      if (socketRef.current) {
        disconnectChat();
        window.removeEventListener('beforeunload', disconnectChat);
        socketRef.current.off('chat-message', handleChatMessage);
        socketRef.current.off('viewer-joined', handleViewerJoined);
        socketRef.current.off('viewer-left', handleViewerLeft);
        socketRef.current.off('live-status', handleLiveStatus);
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    console.log(message);
    socketRef.current!.emit('chat-message', {
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
        localViewer: { username: localViewerNameRef.current },
        isLive,
        remoteViewer,
        guestViewer,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export function useRoom() {
  const context = React.useContext(RoomContext);
  if (!context) {
    throw Error(
      'tried to access room context outside of StreamingRoom component'
    );
  }
  return context;
}
