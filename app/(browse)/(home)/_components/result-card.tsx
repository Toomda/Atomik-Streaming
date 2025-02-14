"use client";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { User } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { LiveVideo } from "@/components/stream-player/live-video";
import { Category } from "@/components/stream-player";
import { useDebounce } from "@/hooks/useDebounce";

interface ResultCardProps {
  data: {
    id: string;
    user: User;
    isLive: boolean;
    name: string;
    Category: Category | null;
    thumbnailExists: boolean;
  };
}

export const ResultCard = ({ data }: ResultCardProps) => {
  const [showStream, setShowStream] = useState(false);
  const debouncedShowStream = useDebounce(showStream, 500);

  const mouseLeave = () => {
    setShowStream(false);
  };

  const mouseEnter = () => {
    setShowStream(true);
  };

  return (
    <div className="space-y-4">
      <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
        {debouncedShowStream ? (
          <LiveVideo username={data.user.username} />
        ) : (
          <Thumbnail
            thumbnailExists={data.thumbnailExists}
            userId={data.user.id!}
            isLive={data.isLive}
            username={data.user.username!}
            streamId={data.id}
          />
        )}
      </div>
      <Link href={`/${data.user.username}`} className="flex gap-x-3">
        <UserAvatar
          userId={data.user.id}
          username={data.user.username!}
          isLive={data.isLive}
        />
        <div className="flex flex-col text-sm overflow-hidden">
          <p className="truncate font-semibold hover:text-blue-500">
            {data.name}
          </p>
          <p className="text-muted-foreground">{data.user.username}</p>
          {data.Category && (
            <p className="text-muted-foreground">{data.Category.name}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="space-y-4">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};
