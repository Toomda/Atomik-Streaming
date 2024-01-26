import { RoomProvider } from "@/context/room-context";

interface StreamingRoomProps {
  classNames?: string;
  children: React.ReactNode;
  hostName: string;
  localViewerName?: string;
  localViewerIdentity?: string;
  isBanned: boolean;
}

export const StreamingRoom = ({
  classNames,
  children,
  hostName,
  localViewerName,
  localViewerIdentity,
  isBanned,
}: StreamingRoomProps) => {
  return (
    <div className={classNames}>
      {
        <RoomProvider
          initialHostName={hostName}
          initialLocalViewerName={localViewerName}
          initialLocalViewerIdentity={localViewerIdentity}
          initialIsBanned={isBanned}
        >
          {children}
        </RoomProvider>
      }
    </div>
  );
};
