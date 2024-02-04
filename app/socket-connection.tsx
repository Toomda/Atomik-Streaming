"use client";

import { useEffect } from "react";
import useSocketStore from "@/store/use-socket"; // Update the import path as necessary
import { getSelf } from "@/lib/auth-service";

const SocketConnection = () => {
  const { connect, disconnect, socket } = useSocketStore();

  useEffect(() => {
    const getUsernameByToken = async () => {
      let self;

      try {
        self = await getSelf();
      } catch (error) {
        return;
      }

      if (!socket && self && self.username) {
        connect(`http://localhost:5000/`, self.username);
      }
    };

    getUsernameByToken();

    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [socket, connect, disconnect]);

  return null;
};

export default SocketConnection;
