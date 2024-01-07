'use client';

import { OfflineVideo } from './offline-video';
import { LoadingVideo } from './loading-video';
import { LiveVideo } from './live-video';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoom } from '@/context/room-context';
import { useState } from 'react';

interface VideoProps {
  hostName: string;
}

export const Video = ({ hostName }: VideoProps) => {
  const { isLive, remoteViewer } = useRoom();

  let content;

  // if (!participant && connectionState === ConnectionState.Connected) {
  //   content = <OfflineVideo username={hostName} />;
  // } else if (!participant || tracks.length === 0) {
  //
  // } else {
  if (isLive) {
    content = <LiveVideo username={hostName} />;
  } else {
    content = <OfflineVideo username={hostName} />;
  }

  // }
  return <div className="aspect-video border-b group relative">{content}</div>;
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
};
