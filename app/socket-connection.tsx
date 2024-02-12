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
      connect(`http://localhost:5000/`, username);
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
