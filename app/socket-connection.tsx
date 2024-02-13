"use client";

import { useEffect } from "react";
import useSocketStore from "@/store/use-socket"; // Update the import path as necessary

interface SocketConnectionProps {
  username: string | undefined;
}

const SocketConnection = ({ username }: SocketConnectionProps) => {
  const { connect, disconnect, socket } = useSocketStore();

  useEffect(() => {
    if (!socket && username) {
      connect(process.env.NEXT_PUBLIC_SOCKET_URL!, username);
    }

    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [socket, connect, disconnect, username]);

  return null;
};

export default SocketConnection;
