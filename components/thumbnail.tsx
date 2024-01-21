import Image from "next/image";
import { UserAvatar } from "./user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "./live-badge";

interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

export const Thumbnail = ({
  src,
  fallback,
  isLive,
  username,
}: ThumbnailProps) => {
  let content;
  if (!src) {
    content = (
      <div className="bg-background flex flex-col items-center justify-center gap-y-4 w-full h-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md">
        <UserAvatar
          imageUrl={fallback}
          size="lg"
          showBadge
          username={username}
          isLive={isLive}
        />
      </div>
    );
  } else {
    content = (
      <Image
        src={`http://localhost:5000/api/${src}`}
        fill
        alt="Thumbnail"
        sizes="h-full w-full"
        className="object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md"
      />
    );
  }

  return (
    <div className="relative rounded-md cursor-pointer aspect-video">
      {content}
      {isLive && src && (
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
    <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
