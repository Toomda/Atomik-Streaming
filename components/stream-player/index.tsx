"use client";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { cn } from "@/lib/utils";
import { Video, VideoSkeleton } from "./video";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { StreamingRoom } from "../streaming-room";

type CustomStream = {
  id: string;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  thumbnail: string | null;
  name: string;
  Category: Category;
};

export type Category = {
  id: string;
  thumbnail: string;
  name: string;
};

type CustomUser = {
  id: string;
  username: string | null;
  bio: string | null;
  stream: CustomStream | null;
  image: string | null;
  _count: { followedBy: number };
};

interface StreamPlayerProps {
  user: CustomUser;
  stream: CustomStream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { identity, name, token } = useViewerToken(user.id);

  const { collapsed } = useChatSidebar((state) => state);

  if (!token || !identity) {
    return <StreamPlayerSkeleton />;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}
      <StreamingRoom
        hostName={user.username!}
        localViewerName={name}
        classNames={cn(
          "grid grid-cols-1 lg:gap-y-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-8 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        <div className="space-y-4 col-span-1 lg:col-span-3 xl:col-span-3 2xl:col-span-6 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={user.username!} />
          <Header
            hostName={user.username!}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.image!}
            isFollowing={isFollowing}
            name={stream.name}
          />
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnail={stream.thumbnail}
            category={stream.Category}
          />
          <AboutCard
            hostName={user.username!}
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio}
            followedByCount={user._count.followedBy}
          />
        </div>
        <div className={cn("col-span-2", collapsed && "hidden")}>
          <Chat
            viewerName={name}
            hostName={user.username!}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatDelayed={stream.isChatDelayed}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
      </StreamingRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};
