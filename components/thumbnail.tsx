"use client";

import Image from "next/image";
import { UserAvatar } from "./user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "./live-badge";
import { useCachebust } from "@/store/use-cachebust";
import { useEffect, useState } from "react";

interface ThumbnailProps {
  thumbnailExists: boolean;
  isLive: boolean;
  username: string;
  userId: string;
  streamId: string;
}

export const Thumbnail = ({
  thumbnailExists,
  isLive,
  username,
  userId,
  streamId,
}: ThumbnailProps) => {
  let content;
  const { streamCacheBust } = useCachebust();
  const [imageSrc, setImageSrc] = useState(
    `${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/StreamThumbnails/${streamId}`
  );

  useEffect(() => {
    setImageSrc(
      `${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/StreamThumbnails/${streamId}?${streamCacheBust}`
    );
  }, [streamCacheBust, streamId]);

  if (!thumbnailExists) {
    content = (
      <div className="bg-background flex flex-col items-center justify-center gap-y-4 w-full h-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md">
        <UserAvatar
          size="lg"
          showBadge
          username={username}
          isLive={isLive}
          userId={userId}
        />
      </div>
    );
  } else {
    content = (
      <>
        <Image
          src={imageSrc}
          fill
          alt="Thumbnail"
          sizes="h-full w-full"
          className="object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md"
          priority
        />
      </>
    );
  }

  return (
    <div className="relative rounded-md cursor-pointer aspect-video">
      {content}
      {isLive && thumbnailExists && (
        <>
          <div className="absolute top-2 left-2">
            <LiveBadge />
          </div>
          <div className="absolute bottom-2 left-2">
            <div className="bg-black bg-opacity-50 text-center p-0.5 px-1.5 rounded-md text-[15px] font-semibold tracking-wide">
              Viewer{` 20.000`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const ThumbnailSkeleton = () => {
  return (
    <div className="relative rounded-md cursor-pointer aspect-video">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
