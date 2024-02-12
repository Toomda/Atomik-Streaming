"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiveBadge } from "./live-badge";
import { useCachebust } from "@/store/use-cachebust";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  username: string;
  isLive?: boolean;
  showBadge?: boolean;
  userId: string;
}

export const UserAvatar = ({
  username,
  isLive,
  showBadge,
  size,
  userId,
}: UserAvatarProps) => {
  const canShowBadge = showBadge && isLive;
  const { userCacheBust } = useCachebust();

  return (
    <div className="relative">
      <Avatar
        className={cn(
          isLive && "ring-2 ring-rose-500 border border-background",
          avatarSizes({ size })
        )}
      >
        <AvatarImage
          src={`${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/UserProfiles/${userId}?${userCacheBust}`}
          className="object-cover"
        />
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};
