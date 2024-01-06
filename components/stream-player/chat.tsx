'use client';

import { ChatVariant, useChatSidebar } from '@/store/use-chat-sidebar';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { ChatHeader, ChatHeaderSkeleton } from './chat-header';
import { ChatForm, ChatFormSkeleton } from './chat-form';
import { ChatList, ChatListSkeleton } from './chat-list';
import { ChatCommunity } from './chat-community';
import { useRoom } from '@/lib/room/room-context';

interface ChatProps {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

export const Chat = ({
  hostIdentity,
  hostName,
  isChatDelayed,
  isChatEnabled,
  isChatFollowersOnly,
  isFollowing,
  viewerName,
}: ChatProps) => {
  const matches = useMediaQuery(`(max-width: 1024px)`);
  const { variant, onExpand } = useChatSidebar((state) => state);

  const isHidden = !isChatEnabled;

  const [value, setValue] = useState('');
  const { messages, sendMessage } = useRoom();

  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);

  const reverserdMessages = useMemo(() => {
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  const onSubmit = () => {
    sendMessage(value);
    setValue('');
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />
      {variant === ChatVariant.CHAT && (
        <>
          <ChatList messages={reverserdMessages} isHidden={isHidden} />
          <ChatForm
            onSubmit={onSubmit}
            value={value}
            onChange={onChange}
            isHidden={isHidden}
            isChatFollowersOnly={isChatFollowersOnly}
            isChatDelayed={isChatDelayed}
            isFollowing={isFollowing}
          />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <ChatCommunity
          viewerName={viewerName}
          hostName={hostName}
          isHidden={isHidden}
        />
      )}
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatHeaderSkeleton />
      <ChatListSkeleton />
      <ChatFormSkeleton />
    </div>
  );
};
