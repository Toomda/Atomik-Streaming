'use client';

import { ChatMessage } from './chat-message';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatMessage as Message } from '@/context/room-context';

interface ChatListProps {
  messages: Message[];
  isHidden: boolean;
}

export const ChatList = ({ messages, isHidden }: ChatListProps) => {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? 'Chat is disabled' : 'Welcome to the Chat!'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full">
      {messages.map((message) => (
        <ChatMessage key={message.timestamp} data={message} />
      ))}
    </div>
  );
};

export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
};
