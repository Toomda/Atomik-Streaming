import { RoomProvider } from '../context/room-context';

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
