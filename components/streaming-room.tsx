import { cn } from '@/lib/utils';
import { RoomProvider } from '../lib/room/room-context';
import { useMemo } from 'react';

interface StreamingRoomProps {
  classNames?: string;
  children: React.ReactNode;
  hostName: string;
  localViewerName: string;
}

export const StreamingRoom = ({
  classNames,
  children,
  hostName,
  localViewerName,
}: StreamingRoomProps) => {
  return (
    <div className={classNames}>
      {
        <RoomProvider
          initialHostName={hostName}
          initialLocalViewerName={localViewerName}
        >
          {children}
        </RoomProvider>
      }
    </div>
  );
};
