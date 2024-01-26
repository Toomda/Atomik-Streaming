"use client";

import { OfflineVideo } from "./offline-video";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoom } from "@/context/room-context";
import { LiveVideo } from "./live-video";
interface VideoProps {
  hostName: string;
}

export const Video = ({ hostName }: VideoProps) => {
  const { isLive } = useRoom();

  let content;

  if (isLive) {
    content = <LiveVideo username={hostName} />;
  } else {
    content = <OfflineVideo username={hostName} />;
  }

  return <div className="aspect-video border-b group relative">{content}</div>;
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
