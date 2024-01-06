import io, { Socket } from 'socket.io-client';

let socket: Socket;
export const connectToSocketServer = () => {
  socket = io('http://localhost:5000/');

  socket.on('connect', () => {
    console.log('Successfully connected with socketio server');
    console.log(socket.id);
  });

  socket.on('chat-message', ({ message }) => {
    console.log('new message came!');
    console.log(message);
  });
};

export const getChatHistory = (username: string) => {
  socket.emit('chat-history', username);
};

export const sendChatMessage = (
  toChannel: string,
  message: string,
  author: string
) => {
  socket.emit('chat-message', {
    toChannel,
    message,
    author,
  });
};
