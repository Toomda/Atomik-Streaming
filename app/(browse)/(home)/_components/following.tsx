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
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      <div className="flex px-5 space-x-2 justify-center">
        {[...streams, ...streams, ...streams].map((stream: any) => (
          <div key={stream.id} className="flex-1 max-w-xs">
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
      <Skeleton className="h-8 w-[290px] mb-4 flex-grow" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[...Array(3)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
