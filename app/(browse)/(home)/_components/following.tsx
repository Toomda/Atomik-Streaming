import { getFollowedStreams } from "@/actions/stream";
import { ResultCard, ResultCardSkeleton } from "./result-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Following = async () => {
  const streams = await getFollowedStreams();

  return (
    <div className="">
      <p className="pb-2 font-bold" style={{ fontSize: "x-large" }}>
        Follower
      </p>
      {streams.length === 0 && (
        <div className="text-muted-foreground text-sm">
          You are not following anyone
        </div>
      )}
      <div className="grid grid-cols-6 gap-4">
        {[...streams].map((stream: any) => (
          <div key={stream.id} className="">
            <ResultCard data={stream} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FollowingSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[150px] mb-4 flex-grow" />
      <div className="grid grid-cols-6 gap-4">
        {[...Array(3)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
