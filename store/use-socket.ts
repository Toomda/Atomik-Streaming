import { create } from "zustand";
import io, { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

interface SocketState {
  socket: Socket | null;
  connect: (url: string) => void;
  disconnect: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connect: (url) => {
    if (!socketInstance) {
      socketInstance = io(url, { transports: ["websocket"] });
    }
    set({ socket: socketInstance });
  },
  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      set({ socket: null });
    }
  },
}));

export default useSocketStore;
