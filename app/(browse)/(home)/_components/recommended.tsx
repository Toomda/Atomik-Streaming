import { getStreams } from "@/actions/stream";
import { ResultCard, ResultCardSkeleton } from "./result-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Recommended = async () => {
  const streams = await getStreams();

  return (
    <div className="">
      {streams.length === 0 && (
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"> */}
      <div className="flex justify-between px-24 space-x-2">
        {streams.map((stream: any) => (
          <div key={stream.id} className="flex-grow">
            <ResultCard data={stream} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecommndedSkeleton = () => {
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
