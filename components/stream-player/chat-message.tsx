'use client';
import { stringToColor } from '@/lib/utils';
import { ChatMessage as Message } from '@/lib/room/room-context';
import { format } from 'date-fns';

interface ChatMessageProps {
  data: Message;
}

export const ChatMessage = ({ data }: ChatMessageProps) => {
  const color = stringToColor(data.author || '');

  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
      <p className="text-sm text-white/40">{format(data.timestamp, 'HH:MM')}</p>
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {data.author}
          </span>
          :
        </p>
        <p className="text-sm break-all">{data.message}</p>
      </div>
    </div>
  );
};
