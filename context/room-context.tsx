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
  username: string;
  image?: string;
}

interface Room {
  remoteViewer: Participant[];
  hostName: string;
  localViewer: Participant;
  isLive: boolean;
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
}

interface RoomProviderProps {
  children: React.ReactNode;
  initialHostName: string;
  initialLocalViewerName: string;
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
  const [isLive, setIsLive] = useState(false);
  const hostNameRef = useRef(initialHostName);
  const localViewerNameRef = useRef(initialLocalViewerName);

  const socket = useMemo(() => {
    return io('http://localhost:5000/');
  }, []);

  useEffect(() => {
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
    };
    fetchRoomInfo();
  }, []);

  useEffect(() => {
    const disconnectChat = () => {
      socket.emit('disconnectChat', {
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
      setRemoteViewer((prev) => {
        if (prev.find((rv) => rv.username === viewer.username)) {
          return prev;
        }
        return [...prev, viewer];
      });
    };

    const handleViewerLeft = (viewer: Participant) => {
      setRemoteViewer((prev) =>
        prev.filter((rv) => rv.username !== viewer.username)
      );
    };

    const handleLiveStatus = (isLive: boolean) => {
      console.log('Got Live status change');
      setIsLive(isLive);
    };

    socket.on('chat-message', handleChatMessage);

    socket.on('viewer-joined', handleViewerJoined);

    socket.on('viewer-left', handleViewerLeft);

    socket.on('live-status', handleLiveStatus);

    window.addEventListener('beforeunload', disconnectChat);

    socket.emit('room-join', {
      hostName: hostNameRef.current,
      viewerName: localViewerNameRef.current,
    });

    return () => {
      window.removeEventListener('beforeunload', disconnectChat);
      socket.off('chat-message', handleChatMessage);
      socket.off('viewer-joined', handleViewerJoined);
      socket.off('viewer-left', handleViewerLeft);
      socket.off('live-status', handleLiveStatus);
      disconnectChat();
    };
  }, [socket, localViewerNameRef, hostNameRef]);

  const sendMessage = (message: string) => {
    socket.emit('chat-message', {
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
        localViewer: { username: localViewerNameRef.current || 'Guest' },
        isLive,
        remoteViewer,
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
