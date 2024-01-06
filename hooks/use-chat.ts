import { connectToSocketServer, getChatHistory } from '../lib/socket-service';
import { useEffect, useState } from 'react';

export interface Message {
  timestamp: number;
  value: string;
  from?: string;
}

export const useChat = (hostName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    connectToSocketServer();
    getChatHistory(hostName);
  }, [hostName]);

  const send = (message: string, viewerName: string) => {
    const newMessage: Message = {
      timestamp: Date.now(),
      value: message,
      from: viewerName,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return {
    messages,
    send,
  };
};
