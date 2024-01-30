"use client";

import { useEffect } from "react";
import useSocketStore from "@/store/use-socket"; // Update the import path as necessary

const SocketConnection = () => {
  const { connect, disconnect, socket } = useSocketStore();

  useEffect(() => {
    if (!socket) {
      connect(`http://localhost:5000/`);
    }

    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [socket, connect, disconnect]);

  return null;
};

export default SocketConnection;
